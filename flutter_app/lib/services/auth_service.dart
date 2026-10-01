import 'package:flutter/foundation.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthService extends ChangeNotifier {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  bool _isLoading = true;
  bool _isLoggedIn = false;
  String? _ownerId;

  bool get isLoading => _isLoading;
  bool get isLoggedIn => _isLoggedIn;
  String? get ownerId => _ownerId;

  AuthService() {
    _checkAuthStatus();
  }

  Future<void> _checkAuthStatus() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      _ownerId = prefs.getString('owner_id');

      if (_auth.currentUser != null) {
        _isLoggedIn = true;
        _ownerId = _auth.currentUser!.uid;
      } else if (_ownerId != null) {
        _isLoggedIn = true;
      } else {
        _isLoggedIn = false;
      }
    } catch (e) {
      _isLoggedIn = false;
    }
    _isLoading = false;
    notifyListeners();
  }

  /// Sign in anonymously (simple owner identification)
  Future<bool> signInAnonymously(String ownerName) async {
    try {
      // For simplicity, we use SharedPreferences to store owner identity
      // In production, use proper Firebase Auth
      final prefs = await SharedPreferences.getInstance();
      final ownerId = 'owner_${DateTime.now().millisecondsSinceEpoch}';
      await prefs.setString('owner_id', ownerId);
      await prefs.setString('owner_name', ownerName);

      _ownerId = ownerId;
      _isLoggedIn = true;
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// Sign in with existing credentials
  Future<bool> signInExisting() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      _ownerId = prefs.getString('owner_id');

      if (_ownerId != null) {
        _isLoggedIn = true;
        _isLoading = false;
        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  /// Sign out
  Future<void> signOut() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    _isLoggedIn = false;
    _ownerId = null;
    notifyListeners();
  }

  String getOwnerName() {
    // Synchronous access - will be populated after init
    return 'Account Owner';
  }
}
