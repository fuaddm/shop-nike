import { EllipsisVertical } from 'lucide-react';
import { Button } from 'react-aria-components';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu';

import { MasterCard } from '@icons/payment/MasterCard';
import { Visa } from '@icons/payment/Visa';

export function CreditCard({
  cardType,
  fullName,
  cardNumber,
  deleteCreditCard,
}: {
  cardType: 'Visa' | 'Mastercard' | 'Unknown';
  fullName: string;
  cardNumber: string;
  deleteCreditCard: () => void;
}) {
  return (
    <div className="bg-surface-container aspect-[1.586/1] rounded-xl transition">
      <div className="flex h-full flex-col justify-between">
        <div className="me-4 mt-2 flex justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="hover:bg-surface-container ms-4 mt-2 aspect-square h-fit rounded-full py-1 transition focus:outline-none">
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 border-none"
              align="start"
            >
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Button
                    onPress={() => deleteCreditCard()}
                    className="w-full"
                  >
                    Delete
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {cardType === 'Visa' && <Visa className="fill-on-surface h-14 w-auto" />}
          {cardType === 'Mastercard' && <MasterCard className="h-14 w-auto" />}
        </div>
        <div className="grid gap-1 ps-5 pb-4">
          <div className="font-mono leading-tight">{fullName}</div>
          <div className="font-mono leading-tight">{cardNumber}</div>
        </div>
      </div>
    </div>
  );
}

export function SimpleCreditCard({
  cardType,
  cardNumber,
}: {
  cardType: 'Visa' | 'Mastercard' | 'Unknown';
  cardNumber: string;
}) {
  return (
    <div className="bg-surface-container hover:bg-surface-container-high rounded-xl px-8 py-2 transition ease-out">
      <div className="flex items-center gap-4">
        {cardType === 'Visa' && <Visa className="fill-on-surface h-14 w-auto" />}
        {cardType === 'Mastercard' && <MasterCard className="h-14 w-auto" />}
        <div className="font-mono leading-tight">{cardNumber}</div>
      </div>
    </div>
  );
}

export function SkeletonCreditCard({ cardType }: { cardType: 'Visa' | 'Mastercard' | 'Unknown' }) {
  return (
    <div className="bg-surface-container hover:bg-surface-container-high rounded-xl px-8 py-2 transition ease-out">
      <div className="flex items-center gap-4">
        {cardType === 'Visa' && <Visa className="fill-on-surface h-14 w-auto" />}
        {cardType === 'Mastercard' && <MasterCard className="h-14 w-auto" />}
        <div className="bg-on-surface animate-pulse rounded-md font-mono leading-tight text-transparent">
          **** **** **** ****
        </div>
      </div>
    </div>
  );
}
