import 'package:cloud_firestore/cloud_firestore.dart';

class ChatSession {
  final String id;
  final String userName;
  final String lastMessage;
  final DateTime lastUpdated;
  final bool unread;
  final int unreadCount;

  ChatSession({
    required this.id,
    required this.userName,
    required this.lastMessage,
    required this.lastUpdated,
    this.unread = false,
    this.unreadCount = 0,
  });

  factory ChatSession.fromFirestore(DocumentSnapshot doc) {
    Map data = doc.data() as Map<String, dynamic>;
    return ChatSession(
      id: doc.id,
      userName: data['userName'] ?? 'Unknown',
      lastMessage: data['lastMessage'] ?? '',
      lastUpdated: (data['lastUpdated'] as Timestamp?)?.toDate() ?? DateTime.now(),
      unread: data['unread'] ?? false,
      unreadCount: data['unreadCount'] ?? 0,
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'userName': userName,
      'lastMessage': lastMessage,
      'lastUpdated': Timestamp.fromDate(lastUpdated),
      'unread': unread,
      'unreadCount': unreadCount,
    };
  }

  ChatSession copyWith({
    String? userName,
    String? lastMessage,
    DateTime? lastUpdated,
    bool? unread,
    int? unreadCount,
  }) {
    return ChatSession(
      id: id,
      userName: userName ?? this.userName,
      lastMessage: lastMessage ?? this.lastMessage,
      lastUpdated: lastUpdated ?? this.lastUpdated,
      unread: unread ?? this.unread,
      unreadCount: unreadCount ?? this.unreadCount,
    );
  }
}
