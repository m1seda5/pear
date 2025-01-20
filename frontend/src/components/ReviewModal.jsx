import { useState, useEffect } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const ReviewModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkForPendingReviews = async () => {
    if (isOpen) return;

    try {
      const res = await fetch("/api/posts/pending-reviews");
      if (!res.ok) throw new Error('Failed to fetch reviews');
      
      const data = await res.json();
      console.log('Pending reviews:', data); // Debug log
      
      if (data.length > 0) {
        const newReview = data[0]; // Take first pending review
        setCurrentReview(newReview);
        setIsOpen(true);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error checking reviews:", err);
    }
  };

  const handleReview = async (decision) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/posts/review/${currentReview._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });

      if (!res.ok) throw new Error('Failed to submit review');
      
      setIsOpen(false);
      setCurrentReview(null);
      setTimeout(checkForPendingReviews, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check immediately on mount
    checkForPendingReviews();
    
    // Then check every 15 seconds
    const interval = setInterval(checkForPendingReviews, 15000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <Alert variant="destructive" className="fixed bottom-4 right-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {currentReview && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Post</DialogTitle>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            <div className="text-sm text-gray-500">
              Posted by: {currentReview.postedBy?.username}
            </div>
            
            <p className="text-base">{currentReview.text}</p>
            
            {currentReview.img && (
              <img 
                src={currentReview.img} 
                alt="Post content" 
                className="rounded-md max-h-64 object-cover"
              />
            )}
          </div>

          <DialogFooter className="space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Skip
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleReview('rejected')}
              disabled={isLoading}
            >
              Reject
            </Button>
            <Button
              onClick={() => handleReview('approved')}
              disabled={isLoading}
            >
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default ReviewModal;