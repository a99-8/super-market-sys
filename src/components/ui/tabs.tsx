import React from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { TabsProps } from "@/types";

export const Tabs: React.FC<TabsProps> = ({
  items,
  selectedIndex,
  onChange,
}) => {
  return (
    <TabGroup selectedIndex={selectedIndex} onChange={onChange}>
      <TabList className="flex space-x-1 space-x-reverse rounded-xl bg-(--bg-subtle) p-1 border border-(--border-color)">
        {items.map((item) => (
          <Tab
            key={item.key}
            className={({ selected }) =>
              `w-full rounded-lg py-2 text-sm font-medium leading-5 transition-all outline-none ${
                selected
                  ? "bg-(--bg-card) text-(--color-primary) shadow-sm font-bold"
                  : "text-(--text-muted) hover:bg-(--bg-card) hover:text-(--text-main)"
              }`
            }
          >
            {item.label}
          </Tab>
        ))}
      </TabList>
      <TabPanels className="mt-2">
        {items.map((item) => (
          <TabPanel
            key={item.key}
            className="rounded-xl bg-(--bg-card) p-3 focus:outline-none border border-(--border-color) text-(--text-main)"
          >
            {item.content}
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
};
