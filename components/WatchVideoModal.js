'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export default function WatchVideoModal({ isOpen, setOpen, videoUrl }) {
  const getYouTubeEmbedURL = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
  };


  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Watch Video</DialogTitle>
          <DialogDescription>
            Preview the project video submitted by the team.
          </DialogDescription>
        </DialogHeader>

        {videoUrl ? (
          <div className="w-full aspect-video rounded overflow-hidden">
            <iframe
              src={getYouTubeEmbedURL(videoUrl)}
              title="Project Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-none rounded"
            />
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No video URL provided.</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
