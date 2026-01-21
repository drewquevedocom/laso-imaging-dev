import { useState } from "react";
import { MessageSquare, Plus, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomerMessages } from "@/hooks/useCustomerMessages";
import { MessageComposer } from "@/components/portal/MessageComposer";
import { ConversationThread } from "@/components/portal/ConversationThread";
import { formatDistanceToNow } from "date-fns";

const PortalMessages = () => {
  const { 
    conversations, 
    loading, 
    totalUnread, 
    createConversation, 
    sendMessage, 
    getMessages 
  } = useCustomerMessages();
  
  const [composerOpen, setComposerOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<{
    id: string;
    subject: string;
  } | null>(null);

  const handleNewMessage = async (subject: string, message: string) => {
    const conversation = await createConversation(subject, message);
    return !!conversation;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  // Show conversation thread if one is selected
  if (selectedConversation) {
    return (
      <ConversationThread
        conversationId={selectedConversation.id}
        subject={selectedConversation.subject}
        onBack={() => setSelectedConversation(null)}
        getMessages={getMessages}
        sendMessage={sendMessage}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground">
            {totalUnread > 0 ? `${totalUnread} unread message${totalUnread !== 1 ? "s" : ""}` : "Contact our support team"}
          </p>
        </div>
        <Button onClick={() => setComposerOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>

      {conversations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-1">No Messages Yet</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Start a conversation with our support team. We're here to help with any questions about equipment, orders, or services.
            </p>
            <Button onClick={() => setComposerOpen(true)}>
              <Mail className="h-4 w-4 mr-2" />
              Send Your First Message
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {conversations.map((conversation) => (
            <Card
              key={conversation.id}
              className={`cursor-pointer transition-colors hover:border-primary/50 ${
                conversation.unread_count > 0 ? "border-primary/30 bg-primary/5" : ""
              }`}
              onClick={() => setSelectedConversation({
                id: conversation.id,
                subject: conversation.subject || "Support Conversation",
              })}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold truncate ${
                        conversation.unread_count > 0 ? "text-foreground" : "text-muted-foreground"
                      }`}>
                        {conversation.subject || "Support Conversation"}
                      </h3>
                      {conversation.unread_count > 0 && (
                        <Badge variant="default" className="h-5 px-1.5 text-xs">
                          {conversation.unread_count}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {conversation.status === "active" ? "Active" : "Closed"}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(conversation.last_message_at || conversation.created_at), { 
                      addSuffix: true 
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <MessageComposer
        open={composerOpen}
        onOpenChange={setComposerOpen}
        onSend={handleNewMessage}
      />
    </div>
  );
};

export default PortalMessages;
