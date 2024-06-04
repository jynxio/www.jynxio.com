'use client';

import clsx from 'clsx';
import css from './Dialog.module.css';
import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

const Root = DialogPrimitive.Root;
const Close = DialogPrimitive.Close;
const Trigger = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <DialogPrimitive.Trigger ref={ref} className={clsx('', className)} {...props} asChild>
        {children}
    </DialogPrimitive.Trigger>
));
const Content = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={css.overlay} />
        <DialogPrimitive.Content ref={ref} className={clsx('', className)} {...props}>
            {children}
        </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
));
const Title = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title ref={ref} className={clsx('', className)} {...props} />
));
const Descr = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description ref={ref} className={clsx('', className)} {...props} />
));

Title.displayName = DialogPrimitive.Title.displayName;
Content.displayName = DialogPrimitive.Content.displayName;
Descr.displayName = DialogPrimitive.Description.displayName;

export { Root, Close, Trigger, Content, Title, Descr };
export default { Root, Close, Trigger, Content, Title, Descr };

// TODO: 记住键盘导航的历史，当dialog结束时，应当返回那个历史；
// TODO: 最初始页面中，键盘导航不应该超出页面本身；
