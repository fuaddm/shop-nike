import { useState } from 'react';
import { Button } from 'react-aria-components';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@ui/Dialog';

export function AllReviews() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button className="bg-secondary text-on-secondary cursor-pointer rounded-full px-4 py-2 transition ease-out hover:scale-95">
          Show More
        </Button>
      </DialogTrigger>
      <DialogContent className="minimalist-scrollbar max-h-10/12 overflow-auto border-none">
        <DialogHeader>
          <DialogTitle>All reviews</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>Content</div>
      </DialogContent>
    </Dialog>
  );
}
