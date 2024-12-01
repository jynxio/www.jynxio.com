"use client";

import css from "./Avatar.module.css";
import React from "react";
import NextImage from "next/image";
import clsx from "clsx";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

const Root = React.forwardRef<
    React.ComponentRef<typeof AvatarPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Root ref={ref} className={className} {...props} />
));
const Image = React.forwardRef<
    React.ComponentRef<typeof AvatarPrimitive.Image>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> &
        React.ComponentPropsWithoutRef<typeof NextImage>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Image ref={ref} className={clsx(className, css.img)} {...props} asChild>
        <NextImage {...props} />
    </AvatarPrimitive.Image>
));
const Fallback = React.forwardRef<
    React.ComponentRef<typeof AvatarPrimitive.Fallback>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback ref={ref} className={className} {...props} />
));

Root.displayName = AvatarPrimitive.Root.displayName;
Image.displayName = AvatarPrimitive.Image.displayName;
Fallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Root, Image, Fallback };
export default { Root, Image, Fallback };
