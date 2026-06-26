'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { postsApi, Post } from '@/lib/api/posts';
import { commentsApi, Comment } from '@/lib/api/comments';
import { useAuthStore } from '@/store/auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function PostDetailPage() {
  const params = useParams();
  const postId = Number(params.id);
  const { isAuthenticated, token } = useAuthStore();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPost();
    loadComments();
  }, [postId]);

  const loadPost = async () => {
    try {
      const data = await postsApi.getById(postId);
      setPost(data);
    } catch (error) {
      console.error('Failed to load post:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const res = await commentsApi.getByPost(postId);
      setComments(res.data);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !token) return;

    setSubmitting(true);
    try {
      await commentsApi.create({ content: newComment, postId }, token);
      setNewComment('');
      toast.success('Comment added');
      loadComments();
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  }

  if (!post) {
    return <div className="container mx-auto px-4 py-8 text-center">Post not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to posts
      </Link>

      <article>
        <div className="flex items-center gap-2 mb-4">
          <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
            {post.status}
          </Badge>
          {post.category && (
            <Badge variant="outline">{post.category.name}</Badge>
          )}
        </div>

        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {post.author?.username || 'Unknown'}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {format(new Date(post.createdAt), 'MMMM d, yyyy')}
          </div>
        </div>

        {post.excerpt && (
          <p className="text-lg text-muted-foreground mb-6 italic">{post.excerpt}</p>
        )}

        <div className="prose prose-lg max-w-none">
          {post.content.split('\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </article>

      <Separator className="my-8" />

      <section>
        <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>

        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-4"
            />
            <Button type="submit" disabled={submitting || !newComment.trim()}>
              {submitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </form>
        ) : (
          <Card className="mb-8">
            <CardContent className="py-4 text-center text-muted-foreground">
              <Link href="/login" className="text-primary hover:underline">Login</Link> to write a comment
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No comments yet</p>
          ) : (
            comments.map((comment) => (
              <Card key={comment.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {comment.author?.username?.charAt(0).toUpperCase() || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{comment.author?.username || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(comment.createdAt), 'MMM d, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{comment.content}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
