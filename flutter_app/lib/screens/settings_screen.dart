import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/settings_service.dart';
import '../services/auth_service.dart';
import '../models/emergency_contact.dart';
import 'login_screen.dart';
import 'package:uuid/uuid.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final settings = Provider.of<SettingsService>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Settings',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Color(0xFF1F2937),
              ),
            ),
            SizedBox(height: 2),
            Text(
              'Manage your emergency contacts',
              style: TextStyle(
                fontSize: 13,
                color: Colors.grey,
                fontWeight: FontWeight.normal,
              ),
            ),
          ],
        ),
        backgroundColor: Colors.white,
        toolbarHeight: 80,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.grey),
            onPressed: () => _showLogoutDialog(context),
          ),
        ],
      ),
      backgroundColor: const Color(0xFFF9FAFB),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Profile Section
          _buildSection(
            title: 'Your Profile',
            icon: Icons.person_outline,
            children: [
              _buildTextField(
                label: 'Display Name',
                value: settings.ownerName,
                onChanged: (value) => settings.saveOwnerName(value),
              ),
              const SizedBox(height: 16),
              _buildTextField(
                label: 'Emergency Message',
                value: settings.emergencyMessage,
                onChanged: (value) => settings.saveEmergencyMessage(value),
                maxLines: 2,
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Emergency Contacts Section
          _buildSection(
            title: 'Emergency Contacts',
            icon: Icons.people_outline,
            trailing: IconButton(
              icon: const Icon(Icons.add, color: Color(0xFFDC2626)),
              onPressed: () => _showAddContactDialog(context),
            ),
            children: [
              if (settings.contacts.isEmpty)
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Center(
                    child: Text(
                      'No contacts added yet',
                      style: TextStyle(color: Colors.grey[500]),
                    ),
                  ),
                )
              else
                ...settings.contacts.map((contact) => _buildContactTile(context, contact)),
            ],
          ),
          const SizedBox(height: 20),

          // Auto-Reply Section
          _buildSection(
            title: 'Auto-Reply',
            icon: Icons.autorenew,
            children: [
              SwitchListTile(
                title: const Text('Enable Auto-Reply'),
                subtitle: const Text('Automatically respond to new chats'),
                value: settings.autoReply,
                onChanged: (_) => settings.toggleAutoReply(),
                activeColor: const Color(0xFFDC2626),
              ),
              if (settings.autoReply)
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                  child: _buildTextField(
                    label: 'Auto-Reply Message',
                    value: settings.autoReplyMessage,
                    onChanged: (value) => settings.saveAutoReplyMessage(value),
                    maxLines: 3,
                  ),
                ),
            ],
          ),
          const SizedBox(height: 20),

          // Notifications Section
          _buildSection(
            title: 'Notifications',
            icon: Icons.notifications_outlined,
            children: [
              SwitchListTile(
                title: const Text('Push Notifications'),
                subtitle: const Text('Get notified for new messages'),
                value: settings.notificationsEnabled,
                onChanged: (_) => settings.toggleNotifications(),
                activeColor: const Color(0xFFDC2626),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // About Section
          _buildSection(
            title: 'About',
            icon: Icons.info_outline,
            children: [
              const ListTile(
                title: Text('Version'),
                subtitle: Text('1.0.0'),
              ),
              const ListTile(
                title: Text('Platform'),
                subtitle: Text('iOS & Android (Flutter)'),
              ),
              ListTile(
                title: const Text('Contact Support'),
                subtitle: const Text('Get help with the app'),
                trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                onTap: () {
                  // Open support
                },
              ),
            ],
          ),
          const SizedBox(height: 40),
        ],
      ),
    );
  }

  Widget _buildSection({
    required String title,
    required IconData icon,
    required List<Widget> children,
    Widget? trailing,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 8, 8),
            child: Row(
              children: [
                Icon(icon, color: const Color(0xFFDC2626), size: 20),
                const SizedBox(width: 8),
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF1F2937),
                  ),
                ),
                if (trailing != null) ...[
                  const Spacer(),
                  trailing,
                ],
              ],
            ),
          ),
          ...children,
          const SizedBox(height: 8),
        ],
      ),
    );
  }

  Widget _buildTextField({
    required String label,
    required String value,
    required ValueChanged<String> onChanged,
    int maxLines = 1,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w500,
              color: Color(0xFF6B7280),
            ),
          ),
          const SizedBox(height: 6),
          TextField(
            controller: TextEditingController(text: value)
              ..selection = TextSelection.collapsed(offset: value.length),
            decoration: InputDecoration(
              isDense: true,
              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(color: Colors.grey[300]!),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(color: Colors.grey[300]!),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: const BorderSide(color: Color(0xFFDC2626), width: 2),
              ),
            ),
            maxLines: maxLines,
            onChanged: onChanged,
          ),
        ],
      ),
    );
  }

  Widget _buildContactTile(BuildContext context, EmergencyContact contact) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      leading: CircleAvatar(
        backgroundColor: const Color(0xFFFEE2E2),
        child: Text(
          contact.name.isNotEmpty ? contact.name[0].toUpperCase() : '?',
          style: const TextStyle(color: Color(0xFFDC2626), fontWeight: FontWeight.bold),
        ),
      ),
      title: Text(contact.name, style: const TextStyle(fontWeight: FontWeight.w500)),
      subtitle: Text('${contact.phone} • ${contact.relationship}'),
      trailing: IconButton(
        icon: const Icon(Icons.delete_outline, color: Colors.grey),
        onPressed: () {
          Provider.of<SettingsService>(context, listen: false)
              .removeContact(contact.id);
        },
      ),
    );
  }

  void _showAddContactDialog(BuildContext context) {
    final nameController = TextEditingController();
    final phoneController = TextEditingController();
    final relationshipController = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Add Emergency Contact'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: nameController,
              decoration: InputDecoration(
                labelText: 'Name',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: phoneController,
              decoration: InputDecoration(
                labelText: 'Phone Number',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
              ),
              keyboardType: TextInputType.phone,
            ),
            const SizedBox(height: 12),
            TextField(
              controller: relationshipController,
              decoration: InputDecoration(
                labelText: 'Relationship',
                hintText: 'e.g., Family, Friend, Colleague',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              if (nameController.text.trim().isNotEmpty &&
                  phoneController.text.trim().isNotEmpty) {
                final contact = EmergencyContact(
                  id: const Uuid().v4(),
                  name: nameController.text.trim(),
                  phone: phoneController.text.trim(),
                  relationship: relationshipController.text.trim().isEmpty
                      ? 'Other'
                      : relationshipController.text.trim(),
                );
                Provider.of<SettingsService>(context, listen: false)
                    .addContact(contact);
                Navigator.pop(ctx);
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFDC2626),
              foregroundColor: Colors.white,
            ),
            child: const Text('Add'),
          ),
        ],
      ),
    );
  }

  void _showLogoutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Sign Out'),
        content: const Text('Are you sure you want to sign out?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(ctx);
              await Provider.of<AuthService>(context, listen: false).signOut();
              if (context.mounted) {
                Navigator.of(context).pushAndRemoveUntil(
                  MaterialPageRoute(builder: (_) => const LoginScreen()),
                  (route) => false,
                );
              }
            },
            child: const Text('Sign Out', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }
}
