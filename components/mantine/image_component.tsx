"use client";

import React from "react";
import { Image, ImageProps } from "@mantine/core";
import { mantineRadius } from "@/utils";

/** Props list of Mantine's Image component - https://mantine.dev/core/image/?t=props */
export interface ImageComponentProps extends ImageProps {

}

/** This is the Mantine Image component - https://mantine.dev/image/group/ */
export const ImageComponent = (props: ImageComponentProps) =>
	<Image {...props} radius={props.radius ?? mantineRadius} />;
