import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Button, Popover, useComposedRefs, Field, Flex, Typography, Box } from "@strapi/design-system";
import { CaretDown } from "@strapi/icons";
import { HexColorPicker } from "react-colorful";
import { useIntl } from "react-intl";
import { styled } from "styled-components";
import { g as getTrad } from "./index-CgXv8Era.mjs";
const ColorPreview = styled.div`
  border-radius: 50%;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  background-color: ${(props) => props.color};
  border: 1px solid rgba(0, 0, 0, 0.1);
`;
const ColorPicker = styled(HexColorPicker)`
  && {
    width: 100%;
    aspect-ratio: 1.5;
  }

  .react-colorful__pointer {
    width: ${({ theme }) => theme.spaces[3]};
    height: ${({ theme }) => theme.spaces[3]};
  }

  .react-colorful__saturation {
    border-radius: ${({ theme }) => theme.spaces[1]};
    border-bottom: none;
  }

  .react-colorful__hue {
    border-radius: 10px;
    height: ${({ theme }) => theme.spaces[3]};
    margin-top: ${({ theme }) => theme.spaces[2]};
  }
`;
const ColorPickerToggle = styled(Button)`
  & > span {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  svg {
    width: ${({ theme }) => theme.spaces[2]};
    height: ${({ theme }) => theme.spaces[2]};
  }

  svg > path {
    fill: ${({ theme }) => theme.colors.neutral500};
    justify-self: flex-end;
  }
`;
const ColorPickerPopover = styled(Popover.Content)`
  padding: ${({ theme }) => theme.spaces[2]};
  min-height: 270px;
`;
const ColorPickerInput = React.forwardRef(
  ({ hint, disabled = false, labelAction, label, name, required = false, onChange, value, error }, forwardedRef) => {
    const [showColorPicker, setShowColorPicker] = React.useState(false);
    const colorPickerButtonRef = React.useRef(null);
    const { formatMessage } = useIntl();
    const color = value || "#000000";
    const composedRefs = useComposedRefs(forwardedRef, colorPickerButtonRef);
    return /* @__PURE__ */ jsx(Field.Root, { name, id: name, error, hint, required, children: /* @__PURE__ */ jsxs(Flex, { direction: "column", alignItems: "stretch", gap: 1, children: [
      /* @__PURE__ */ jsx(Field.Label, { action: labelAction, children: label }),
      /* @__PURE__ */ jsxs(Popover.Root, { onOpenChange: setShowColorPicker, children: [
        /* @__PURE__ */ jsx(Popover.Trigger, { children: /* @__PURE__ */ jsxs(
          ColorPickerToggle,
          {
            ref: composedRefs,
            "aria-label": formatMessage({
              id: getTrad("color-picker.toggle.aria-label"),
              defaultMessage: "Color picker toggle"
            }),
            "aria-controls": "color-picker-value",
            "aria-haspopup": "dialog",
            "aria-expanded": showColorPicker,
            "aria-disabled": disabled,
            disabled,
            variant: "tertiary",
            size: "L",
            children: [
              /* @__PURE__ */ jsxs(Flex, { children: [
                /* @__PURE__ */ jsx(ColorPreview, { color }),
                /* @__PURE__ */ jsx(
                  Typography,
                  {
                    style: { textTransform: "uppercase" },
                    textColor: value ? void 0 : "neutral600",
                    variant: "omega",
                    children: color
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(CaretDown, { "aria-hidden": true })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxs(ColorPickerPopover, { sideOffset: 4, children: [
          /* @__PURE__ */ jsx(ColorPicker, { color, onChange: (hexValue) => onChange(name, hexValue) }),
          /* @__PURE__ */ jsxs(Flex, { paddingTop: 3, paddingLeft: 4, justifyContent: "flex-end", children: [
            /* @__PURE__ */ jsx(Box, { paddingRight: 2, children: /* @__PURE__ */ jsx(Typography, { variant: "omega", tag: "label", textColor: "neutral600", children: formatMessage({
              id: getTrad("color-picker.input.format"),
              defaultMessage: "HEX"
            }) }) }),
            /* @__PURE__ */ jsx(Field.Root, { children: /* @__PURE__ */ jsx(
              Field.Input,
              {
                "aria-label": formatMessage({
                  id: getTrad("color-picker.input.aria-label"),
                  defaultMessage: "Color picker input"
                }),
                style: { textTransform: "uppercase" },
                value,
                placeholder: "#000000",
                onChange
              }
            ) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(Field.Hint, {}),
      /* @__PURE__ */ jsx(Field.Error, {})
    ] }) });
  }
);
export {
  ColorPickerInput
};
