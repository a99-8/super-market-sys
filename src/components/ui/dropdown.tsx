import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { DropdownProps } from "@/types";

export const Dropdown: React.FC<DropdownProps> = ({ trigger, items }) => {
  return (
    <Menu as="div" className="relative inline-block text-right">
      <Menu.Button as={Fragment}>{trigger}</Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 z-10 mt-2 w-48 origin-top-left rounded-md bg-(--bg-card) shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none divide-y divide-(--border-color) border border-(--border-color)">
          <div className="py-1">
            {items.map((item, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <button
                    onClick={item.onClick}
                    className={`${active ? "bg-(--bg-subtle)" : ""} ${
                      item.danger
                        ? "text-(--color-danger)"
                        : "text-(--text-main)"
                    } group flex w-full items-center px-4 py-2 text-sm gap-2 transition-colors`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
