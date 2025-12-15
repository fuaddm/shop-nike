import { Button, Disclosure, DisclosureGroup, DisclosurePanel, Heading } from 'react-aria-components';

import type { IProductDisclosureProperties } from '@models/components/ui/disclosure';

export function ProductDisclosure({ additionalInformations }: IProductDisclosureProperties) {
  return (
    <DisclosureGroup
      className="bg-surface-variant rounded-md"
      allowsMultipleExpanded
    >
      {additionalInformations.map((item) => {
        return (
          <Disclosure
            key={item.title}
            id={item.title}
            className="group border-outline-variant border-b last:border-b-0"
          >
            <Heading>
              <Button
                slot="trigger"
                className="flex w-full items-center justify-between px-3 py-4 text-lg italic"
              >
                {item.title}
                <div className="relative z-0 h-5 w-5 transition ease-out group-data-[expanded]:rotate-45">
                  <div className="bg-outline absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2"></div>
                  <div className="bg-outline absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 rotate-90"></div>
                </div>
              </Button>
            </Heading>
            <DisclosurePanel className="text-on-surface-variant group-data-[expanded]:px-3 group-data-[expanded]:pb-4">
              <p>{item.text}</p>
            </DisclosurePanel>
          </Disclosure>
        );
      })}
    </DisclosureGroup>
  );
}
