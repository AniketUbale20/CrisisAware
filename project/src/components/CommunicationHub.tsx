import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Phone, Radio, Users, AlertTriangle, CheckCircle, Clock, Mic, MicOff, Volume2 } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'voice' | 'alert' | 'status';
  priority: 'low' | 'medium' | 'high' | 'critical';
  read: boolean;
  channel: string;
}

interface Channel {
  id: string;
  name: string;
  type: 'emergency' | 'coordination' | 'public' | 'internal';
  participants: number;
  active: boolean;
  lastActivity: Date;
}

interface Contact {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'online' | 'busy' | 'away' | 'offline';
  lastSeen: Date;
}

export const CommunicationHub: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Fire Chief Johnson',
      recipient: 'All Units',
      content: 'Structure fire at 42nd & Broadway - Engine 14 and Ladder 8 respond immediately',
      timestamp: new Date(Date.now() - 2 * 60000),
      type: 'alert',
      priority: 'critical',
      read: true,
      channel: 'emergency'
    },
    {
      id: '2',
      sender: 'Dispatch Central',
      recipient: 'Patrol 23',
      content: 'Traffic incident reported at Times Square intersection, please investigate',
      timestamp: new Date(Date.now() - 5 * 60000),
      type: 'text',
      priority: 'medium',
      read: true,
      channel: 'coordination'
    },
    {
      id: '3',
      sender: 'Medical Unit 07',
      recipient: 'Dispatch Central',
      content: 'Patient transported to Metro General, returning to service',
      timestamp: new Date(Date.now() - 8 * 60000),
      type: 'status',
      priority: 'low',
      read: false,
      channel: 'coordination'
    }
  ]);

  const [channels, setChannels] = useState<Channel[]>([
    {
      id: 'emergency',
      name: 'Emergency Response',
      type: 'emergency',
      participants: 45,
      active: true,
      lastActivity: new Date(Date.now() - 1 * 60000)
    },
    {
      id: 'coordination',
      name: 'Dispatch Coordination',
      type: 'coordination',
      participants: 23,
      active: true,
      lastActivity: new Date(Date.now() - 3 * 60000)
    },
    {
      id: 'public',
      name: 'Public Information',
      type: 'public',
      participants: 156,
      active: false,
      lastActivity: new Date(Date.now() - 15 * 60000)
    },
    {
      id: 'internal',
      name: 'Internal Operations',
      type: 'internal',
      participants: 12,
      active: true,
      lastActivity: new Date(Date.now() - 7 * 60000)
    }
  ]);

  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Chief Johnson',
      role: 'Fire Chief',
      department: 'Fire Department',
      status: 'online',
      lastSeen: new Date()
    },
    {
      id: '2',
      name: 'Capt. Rodriguez',
      role: 'Police Captain',
      department: 'Police Department',
      status: 'busy',
      lastSeen: new Date(Date.now() - 5 * 60000)
    },
    {
      id: '3',
      name: 'Dr. Chen',
      role: 'Medical Director',
      department: 'Emergency Medical',
      status: 'online',
      lastSeen: new Date(Date.now() - 2 * 60000)
    },
    {
      id: '4',
      name: 'Dispatch Alpha',
      role: 'Dispatcher',
      department: 'Central Dispatch',
      status: 'online',
      lastSeen: new Date()
    }
  ]);

  const [selectedChannel, setSelectedChannel] = useState('emergency');
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Simulate incoming messages
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const newMsg: Message = {
          id: Date.now().toString(),
          sender: contacts[Math.floor(Math.random() * contacts.length)].name,
          recipient: 'All Units',
          content: 'System update: All units operating normally',
          timestamp: new Date(),
          type: 'status',
          priority: 'low',
          read: false,
          channel: selectedChannel
        };
        setMessages(prev => [newMsg, ...prev].slice(0, 20));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [selectedChannel, contacts]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: 'You',
        recipient: 'All Units',
        content: newMessage,
        timestamp: new Date(),
        type: 'text',
        priority: 'medium',
        read: true,
        channel: selectedChannel
      };
      setMessages(prev => [message, ...prev]);
      setNewMessage('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'busy': return 'bg-red-400';
      case 'away': return 'bg-yellow-400';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-l-red-500 bg-red-500/5';
      case 'high': return 'border-l-orange-500 bg-orange-500/5';
      case 'medium': return 'border-l-yellow-500 bg-yellow-500/5';
      case 'low': return 'border-l-green-500 bg-green-500/5';
      default: return 'border-l-gray-500 bg-gray-500/5';
    }
  };

  const getChannelColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'text-red-400 bg-red-400/10';
      case 'coordination': return 'text-blue-400 bg-blue-400/10';
      case 'public': return 'text-green-400 bg-green-400/10';
      case 'internal': return 'text-purple-400 bg-purple-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const filteredMessages = messages.filter(msg => msg.channel === selectedChannel);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center space-x-3">
            <MessageSquare className="w-8 h-8 text-green-400" />
            <span>Communication Hub</span>
          </h1>
          <p className="text-slate-400">Real-time communication and coordination center</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3 rounded-lg transition-colors ${
              isMuted ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <div className="flex items-center space-x-2 bg-slate-800 px-3 py-2 rounded-lg">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-slate-300 text-sm">All Systems Online</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Channels Sidebar */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Radio className="w-5 h-5 text-blue-400" />
            <span>Channels</span>
          </h3>
          
          <div className="space-y-2">
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => setSelectedChannel(channel.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedChannel === channel.id 
                    ? 'bg-blue-500/20 border border-blue-500/30' 
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-white">{channel.name}</span>
                  {channel.active && <div className="w-2 h-2 bg-green-400 rounded-full"></div>}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2 py-1 rounded ${getChannelColor(channel.type)}`}>
                    {channel.type}
                  </span>
                  <span className="text-slate-400">{channel.participants} users</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700">
            <h4 className="text-sm font-semibold text-white mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <button className="w-full p-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors">
                Emergency Broadcast
              </button>
              <button className="w-full p-2 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm hover:bg-yellow-500/30 transition-colors">
                All Units Status
              </button>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 flex flex-col h-[600px]">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">
                  {channels.find(c => c.id === selectedChannel)?.name}
                </h3>
                <p className="text-sm text-slate-400">
                  {channels.find(c => c.id === selectedChannel)?.participants} participants
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`p-2 rounded-lg transition-colors ${
                    isRecording 
                      ? 'bg-red-500/20 text-red-400' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {filteredMessages.map((message) => (
              <div key={message.id} className={`border-l-4 pl-4 py-2 ${getPriorityColor(message.priority)}`}>
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-white">{message.sender}</span>
                    <span className="text-xs text-slate-400">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    {message.type === 'voice' && <Mic className="w-3 h-3 text-blue-400" />}
                    {message.type === 'alert' && <AlertTriangle className="w-3 h-3 text-red-400" />}
                  </div>
                  {!message.read && <div className="w-2 h-2 bg-blue-400 rounded-full"></div>}
                </div>
                <p className="text-slate-300">{message.content}</p>
                <div className="text-xs text-slate-400 mt-1">To: {message.recipient}</div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Contacts Sidebar */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Users className="w-5 h-5 text-green-400" />
            <span>Active Personnel</span>
          </h3>
          
          <div className="space-y-3">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-700 transition-colors">
                <div className="relative">
                  <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-white">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-800 ${getStatusColor(contact.status)}`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white text-sm">{contact.name}</div>
                  <div className="text-xs text-slate-400">{contact.role}</div>
                  <div className="text-xs text-slate-500">{contact.department}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700">
            <h4 className="text-sm font-semibold text-white mb-3">System Status</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Radio Network:</span>
                <span className="text-green-400 flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Online</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Satellite Link:</span>
                <span className="text-green-400 flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Connected</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Emergency Alerts:</span>
                <span className="text-yellow-400 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Monitoring</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};