import 'package:flutter/foundation.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/message.dart';
import '../models/chat_session.dart';

class ChatService extends ChangeNotifier {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  List<ChatSession> _chats = [];
  bool _isLoading = false;

  List<ChatSession> get chats => _chats;
  bool get isLoading => _isLoading;

  ChatService() {
    _listenToChats();
  }

  /// Listen to all chat sessions in real-time
  void _listenToChats() {
    _firestore
        .collection('chats')
        .orderBy('lastUpdated', descending: true)
        .snapshots()
        .listen((snapshot) {
      _chats = snapshot.docs.map((doc) => ChatSession.fromFirestore(doc)).toList();
      _isLoading = false;
      notifyListeners();
    }, onError: (error) {
      debugPrint('Error listening to chats: $error');
      _isLoading = false;
      notifyListeners();
    });
  }

  /// Listen to messages in a specific chat
  Stream<List<Message>> getMessages(String chatId) {
    return _firestore
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .orderBy('timestamp', descending: false)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs.map((doc) => Message.fromFirestore(doc)).toList();
    });
  }

  /// Send a message as the owner
  Future<void> sendMessage(String chatId, String text) async {
    try {
      final message = Message(
        id: '',
        text: text,
        sender: 'owner',
        timestamp: DateTime.now(),
      );

      // Add message to subcollection
      await _firestore
          .collection('chats')
          .doc(chatId)
          .collection('messages')
          .add(message.toFirestore());

      // Update chat session
      await _firestore.collection('chats').doc(chatId).update({
        'lastMessage': text,
        'lastUpdated': FieldValue.serverTimestamp(),
        'unread': false,
        'unreadCount': 0,
      });
    } catch (e) {
      debugPrint('Error sending message: $e');
      rethrow;
    }
  }

  /// Mark a chat as read
  Future<void> markAsRead(String chatId) async {
    try {
      await _firestore.collection('chats').doc(chatId).update({
        'unread': false,
        'unreadCount': 0,
      });
    } catch (e) {
      debugPrint('Error marking as read: $e');
    }
  }

  /// Delete a chat
  Future<void> deleteChat(String chatId) async {
    try {
      // Delete all messages first
      final messages = await _firestore
          .collection('chats')
          .doc(chatId)
          .collection('messages')
          .get();

      for (var doc in messages.docs) {
        await doc.reference.delete();
      }

      // Delete the chat session
      await _firestore.collection('chats').doc(chatId).delete();
    } catch (e) {
      debugPrint('Error deleting chat: $e');
      rethrow;
    }
  }

  /// Get unread count
  int get unreadCount {
    return _chats.where((chat) => chat.unread).length;
  }
}
