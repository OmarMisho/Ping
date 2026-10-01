import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../models/emergency_contact.dart';

class SettingsService extends ChangeNotifier {
  String _ownerName = 'Account Owner';
  String _emergencyMessage = 'In case of any emergency, text me';
  List<EmergencyContact> _contacts = [];
  bool _autoReply = true;
  String _autoReplyMessage = 'Thank you for reaching out. I will respond as soon as possible.';
  bool _notificationsEnabled = true;

  String get ownerName => _ownerName;
  String get emergencyMessage => _emergencyMessage;
  List<EmergencyContact> get contacts => _contacts;
  bool get autoReply => _autoReply;
  String get autoReplyMessage => _autoReplyMessage;
  bool get notificationsEnabled => _notificationsEnabled;

  SettingsService() {
    _loadSettings();
  }

  Future<void> _loadSettings() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      _ownerName = prefs.getString('owner_name') ?? 'Account Owner';
      _emergencyMessage = prefs.getString('emergency_message') ?? 'In case of any emergency, text me';
      _autoReply = prefs.getBool('auto_reply') ?? true;
      _autoReplyMessage = prefs.getString('auto_reply_message') ?? 'Thank you for reaching out.';
      _notificationsEnabled = prefs.getBool('notifications_enabled') ?? true;

      final contactsJson = prefs.getString('contacts');
      if (contactsJson != null) {
        final List<dynamic> contactsList = json.decode(contactsJson);
        _contacts = contactsList.map((c) => EmergencyContact.fromMap(c)).toList();
      }

      notifyListeners();
    } catch (e) {
      debugPrint('Error loading settings: $e');
    }
  }

  Future<void> saveOwnerName(String name) async {
    _ownerName = name;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('owner_name', name);
    notifyListeners();
  }

  Future<void> saveEmergencyMessage(String message) async {
    _emergencyMessage = message;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('emergency_message', message);
    notifyListeners();
  }

  Future<void> addContact(EmergencyContact contact) async {
    _contacts.add(contact);
    await _saveContacts();
    notifyListeners();
  }

  Future<void> removeContact(String contactId) async {
    _contacts.removeWhere((c) => c.id == contactId);
    await _saveContacts();
    notifyListeners();
  }

  Future<void> _saveContacts() async {
    final prefs = await SharedPreferences.getInstance();
    final contactsJson = json.encode(_contacts.map((c) => c.toMap()).toList());
    await prefs.setString('contacts', contactsJson);
  }

  Future<void> toggleAutoReply() async {
    _autoReply = !_autoReply;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('auto_reply', _autoReply);
    notifyListeners();
  }

  Future<void> saveAutoReplyMessage(String message) async {
    _autoReplyMessage = message;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auto_reply_message', message);
    notifyListeners();
  }

  Future<void> toggleNotifications() async {
    _notificationsEnabled = !_notificationsEnabled;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('notifications_enabled', _notificationsEnabled);
    notifyListeners();
  }
}
