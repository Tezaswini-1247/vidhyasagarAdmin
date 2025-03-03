import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useTracking, useForm, useField, InputRenderer as InputRenderer$1, useNotification, ConfirmDialog, Page, useAPIErrorHandler, useRBAC, Form, BackButton } from "@strapi/admin/strapi-admin";
import { useLicenseLimits } from "@strapi/admin/strapi-admin/ee";
import { Box, Typography, Flex, Accordion, MenuItem, Menu, MultiSelectOption, useComposedRefs, VisuallyHidden, IconButton, Grid, Field, SingleSelect, SingleSelectOption, TextInput, MultiSelect, MultiSelectGroup, Dialog, useCollator, Button } from "@strapi/design-system";
import { PlusCircle, More, Drag, EyeStriked, Duplicate, Check } from "@strapi/icons";
import { generateNKeysBetween } from "fractional-indexing";
import { useIntl } from "react-intl";
import { useParams, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { r as reviewWorkflowsApi, A as AVAILABLE_COLORS, g as getStageColorByHex, u as useGetContentTypesQuery, a as useTypedSelector, C as CHARGEBEE_WORKFLOW_ENTITLEMENT_NAME, b as CHARGEBEE_STAGES_PER_WORKFLOW_ENTITLEMENT_NAME, L as LimitsModal, i as isBaseQueryError } from "./index-C_-s412E.mjs";
import { D as DRAG_DROP_TYPES, u as useReviewWorkflows, a as DragLayerRendered, H as Header, R as Root } from "./Layout-BGC42hTJ.mjs";
import { getEmptyImage } from "react-dnd-html5-backend";
import { styled } from "styled-components";
import { useDrop, useDrag } from "react-dnd";
const adminApi = reviewWorkflowsApi.injectEndpoints({
  endpoints(builder) {
    return {
      getAdminRoles: builder.query({
        query: () => ({
          url: `/admin/roles`,
          method: "GET"
        }),
        transformResponse: (res) => {
          return res.data;
        }
      })
    };
  }
});
const { useGetAdminRolesQuery } = adminApi;
const useKeyboardDragAndDrop = (active, index, { onCancel, onDropItem, onGrabItem, onMoveItem }) => {
  const [isSelected, setIsSelected] = React.useState(false);
  const handleMove = (movement) => {
    if (!isSelected) {
      return;
    }
    if (typeof index === "number" && onMoveItem) {
      if (movement === "UP") {
        onMoveItem(index - 1, index);
      } else if (movement === "DOWN") {
        onMoveItem(index + 1, index);
      }
    }
  };
  const handleDragClick = () => {
    if (isSelected) {
      if (onDropItem) {
        onDropItem(index);
      }
      setIsSelected(false);
    } else {
      if (onGrabItem) {
        onGrabItem(index);
      }
      setIsSelected(true);
    }
  };
  const handleCancel = () => {
    if (isSelected) {
      setIsSelected(false);
      if (onCancel) {
        onCancel(index);
      }
    }
  };
  const handleKeyDown = (e) => {
    if (!active) {
      return;
    }
    if (e.key === "Tab" && !isSelected) {
      return;
    }
    e.preventDefault();
    switch (e.key) {
      case " ":
      case "Enter":
        handleDragClick();
        break;
      case "Escape":
        handleCancel();
        break;
      case "ArrowDown":
      case "ArrowRight":
        handleMove("DOWN");
        break;
      case "ArrowUp":
      case "ArrowLeft":
        handleMove("UP");
        break;
    }
  };
  return handleKeyDown;
};
const DIRECTIONS = {
  UPWARD: "upward",
  DOWNWARD: "downward"
};
const DROP_SENSITIVITY = {
  REGULAR: "regular",
  IMMEDIATE: "immediate"
};
const useDragAndDrop = (active, {
  type = "STRAPI_DND",
  index,
  item,
  onStart,
  onEnd,
  onGrabItem,
  onDropItem,
  onCancel,
  onMoveItem,
  dropSensitivity = DROP_SENSITIVITY.REGULAR
}) => {
  const objectRef = React.useRef(null);
  const [{ handlerId, isOver }, dropRef] = useDrop({
    accept: type,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isOver: monitor.isOver({ shallow: true })
      };
    },
    drop(item2) {
      const draggedIndex = item2.index;
      const newIndex = index;
      if (isOver && onDropItem) {
        onDropItem(draggedIndex, newIndex);
      }
    },
    hover(item2, monitor) {
      if (!objectRef.current || !onMoveItem) {
        return;
      }
      const dragIndex = item2.index;
      const newIndex = index;
      const hoverBoundingRect = objectRef.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset && clientOffset.y - hoverBoundingRect.top;
      if (typeof dragIndex === "number" && typeof newIndex === "number") {
        if (dragIndex === newIndex) {
          return;
        }
        if (dropSensitivity === DROP_SENSITIVITY.REGULAR) {
          if (dragIndex < newIndex && hoverClientY < hoverMiddleY) {
            return;
          }
          if (dragIndex > newIndex && hoverClientY > hoverMiddleY) {
            return;
          }
        }
        onMoveItem(newIndex, dragIndex);
        item2.index = newIndex;
      } else {
        if (Array.isArray(dragIndex) && Array.isArray(newIndex)) {
          const minLength = Math.min(dragIndex.length, newIndex.length);
          let areEqual = true;
          let isLessThan = false;
          let isGreaterThan = false;
          for (let i = 0; i < minLength; i++) {
            if (dragIndex[i] < newIndex[i]) {
              isLessThan = true;
              areEqual = false;
              break;
            } else if (dragIndex[i] > newIndex[i]) {
              isGreaterThan = true;
              areEqual = false;
              break;
            }
          }
          if (areEqual && dragIndex.length === newIndex.length) {
            return;
          }
          if (dropSensitivity === DROP_SENSITIVITY.REGULAR) {
            if (isLessThan && !isGreaterThan && hoverClientY < hoverMiddleY) {
              return;
            }
            if (isGreaterThan && !isLessThan && hoverClientY > hoverMiddleY) {
              return;
            }
          }
        }
        onMoveItem(newIndex, dragIndex);
        item2.index = newIndex;
      }
    }
  });
  const getDragDirection = (monitor) => {
    if (monitor && monitor.isDragging() && !monitor.didDrop() && monitor.getInitialClientOffset() && monitor.getClientOffset()) {
      const deltaY = monitor.getInitialClientOffset().y - monitor.getClientOffset().y;
      if (deltaY > 0) return DIRECTIONS.UPWARD;
      if (deltaY < 0) return DIRECTIONS.DOWNWARD;
      return null;
    }
    return null;
  };
  const [{ isDragging, direction }, dragRef, dragPreviewRef] = useDrag({
    type,
    item() {
      if (onStart) {
        onStart();
      }
      const { width } = objectRef.current?.getBoundingClientRect() ?? {};
      return { index, width, ...item };
    },
    end() {
      if (onEnd) {
        onEnd();
      }
    },
    canDrag: active,
    /**
     * This is useful when the item is in a virtualized list.
     * However, if we don't have an ID then we want the libraries
     * defaults to take care of this.
     */
    isDragging: item?.id ? (monitor) => {
      return item.id === monitor.getItem().id;
    } : void 0,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      initialOffset: monitor.getInitialClientOffset(),
      currentOffset: monitor.getClientOffset(),
      direction: getDragDirection(monitor)
    })
  });
  const handleKeyDown = useKeyboardDragAndDrop(active, index, {
    onGrabItem,
    onDropItem,
    onCancel,
    onMoveItem
  });
  return [
    { handlerId, isDragging, handleKeyDown, isOverDropTarget: isOver, direction },
    objectRef,
    dropRef,
    dragRef,
    dragPreviewRef
  ];
};
const AddStage = ({ children, ...props }) => {
  return /* @__PURE__ */ jsx(
    StyledButton,
    {
      tag: "button",
      background: "neutral0",
      borderColor: "neutral150",
      paddingBottom: 3,
      paddingLeft: 4,
      paddingRight: 4,
      paddingTop: 3,
      shadow: "filterShadow",
      ...props,
      children: /* @__PURE__ */ jsx(Typography, { variant: "pi", fontWeight: "bold", children: /* @__PURE__ */ jsxs(Flex, { tag: "span", gap: 2, children: [
        /* @__PURE__ */ jsx(PlusCircle, { width: "2.4rem", height: "2.4rem", "aria-hidden": true }),
        children
      ] }) })
    }
  );
};
const StyledButton = styled(Box)`
  border-radius: 26px;
  color: ${({ theme }) => theme.colors.neutral500};

  &:hover {
    color: ${({ theme }) => theme.colors.primary600};
  }

  &:active {
    color: ${({ theme }) => theme.colors.primary600};
  }
`;
const Stages = ({ canDelete = true, canUpdate = true, isCreating }) => {
  const { formatMessage } = useIntl();
  const { trackUsage } = useTracking();
  const addFieldRow = useForm("Stages", (state) => state.addFieldRow);
  const { value: stages = [] } = useField("stages");
  return /* @__PURE__ */ jsxs(Flex, { direction: "column", gap: 6, width: "100%", children: [
    /* @__PURE__ */ jsxs(Box, { position: "relative", width: "100%", children: [
      /* @__PURE__ */ jsx(
        Background,
        {
          background: "neutral200",
          height: "100%",
          left: "50%",
          position: "absolute",
          top: "0",
          width: 2
        }
      ),
      /* @__PURE__ */ jsx(Flex, { direction: "column", alignItems: "stretch", gap: 6, position: "relative", tag: "ol", children: stages.map((stage, index) => {
        return /* @__PURE__ */ jsx(Box, { tag: "li", children: /* @__PURE__ */ jsx(
          Stage,
          {
            index,
            canDelete: stages.length > 1 && canDelete,
            canReorder: stages.length > 1,
            canUpdate,
            stagesCount: stages.length,
            defaultOpen: !stage.id,
            ...stage
          }
        ) }, stage.__temp_key__);
      }) })
    ] }),
    canUpdate && /* @__PURE__ */ jsx(
      AddStage,
      {
        type: "button",
        onClick: () => {
          addFieldRow("stages", { name: "" });
          trackUsage("willCreateStage");
        },
        children: formatMessage({
          id: "Settings.review-workflows.stage.add",
          defaultMessage: "Add new stage"
        })
      }
    )
  ] });
};
const Background = styled(Box)`
  transform: translateX(-50%);
`;
const Stage = ({
  index,
  canDelete = false,
  canReorder = false,
  canUpdate = false,
  stagesCount,
  name,
  permissions,
  color,
  defaultOpen
}) => {
  const [liveText, setLiveText] = React.useState();
  const { formatMessage } = useIntl();
  const { trackUsage } = useTracking();
  const stageErrors = useForm("Stages", (state) => state.errors.stages);
  const error = stageErrors?.[index];
  const addFieldRow = useForm("Stage", (state) => state.addFieldRow);
  const moveFieldRow = useForm("Stage", (state) => state.moveFieldRow);
  const removeFieldRow = useForm("Stage", (state) => state.removeFieldRow);
  const getItemPos = (index2) => `${index2 + 1} of ${stagesCount}`;
  const handleGrabStage = (index2) => {
    setLiveText(
      formatMessage(
        {
          id: "dnd.grab-item",
          defaultMessage: `{item}, grabbed. Current position in list: {position}. Press up and down arrow to change position, Spacebar to drop, Escape to cancel.`
        },
        {
          item: name,
          position: getItemPos(index2)
        }
      )
    );
  };
  const handleDropStage = (index2) => {
    setLiveText(
      formatMessage(
        {
          id: "dnd.drop-item",
          defaultMessage: `{item}, dropped. Final position in list: {position}.`
        },
        {
          item: name,
          position: getItemPos(index2)
        }
      )
    );
  };
  const handleCancelDragStage = () => {
    setLiveText(
      formatMessage(
        {
          id: "dnd.cancel-item",
          defaultMessage: "{item}, dropped. Re-order cancelled."
        },
        {
          item: name
        }
      )
    );
  };
  const handleMoveStage = (newIndex, oldIndex) => {
    setLiveText(
      formatMessage(
        {
          id: "dnd.reorder",
          defaultMessage: "{item}, moved. New position in list: {position}."
        },
        {
          item: name,
          position: getItemPos(newIndex)
        }
      )
    );
    moveFieldRow("stages", oldIndex, newIndex);
  };
  const [{ handlerId, isDragging, handleKeyDown }, stageRef, dropRef, dragRef, dragPreviewRef] = useDragAndDrop(canReorder, {
    index,
    item: {
      index,
      name
    },
    onGrabItem: handleGrabStage,
    onDropItem: handleDropStage,
    onMoveItem: handleMoveStage,
    onCancel: handleCancelDragStage,
    type: DRAG_DROP_TYPES.STAGE
  });
  const composedRef = useComposedRefs(stageRef, dropRef);
  React.useEffect(() => {
    dragPreviewRef(getEmptyImage(), { captureDraggingState: false });
  }, [dragPreviewRef, index]);
  const handleCloneClick = () => {
    addFieldRow("stages", { name, color, permissions });
  };
  const id = React.useId();
  return /* @__PURE__ */ jsxs(Box, { ref: composedRef, shadow: "tableShadow", children: [
    liveText && /* @__PURE__ */ jsx(VisuallyHidden, { "aria-live": "assertive", children: liveText }),
    isDragging ? /* @__PURE__ */ jsx(
      Box,
      {
        background: "primary100",
        borderStyle: "dashed",
        borderColor: "primary600",
        borderWidth: "1px",
        display: "block",
        hasRadius: true,
        padding: 6
      }
    ) : /* @__PURE__ */ jsx(
      AccordionRoot,
      {
        onValueChange: (value) => {
          if (value) {
            trackUsage("willEditStage");
          }
        },
        defaultValue: defaultOpen ? id : void 0,
        $error: Object.values(error ?? {}).length > 0,
        children: /* @__PURE__ */ jsxs(Accordion.Item, { value: id, children: [
          /* @__PURE__ */ jsxs(Accordion.Header, { children: [
            /* @__PURE__ */ jsx(Accordion.Trigger, { children: name }),
            /* @__PURE__ */ jsx(Accordion.Actions, { children: canDelete || canUpdate ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs(Menu.Root, { children: [
                /* @__PURE__ */ jsxs(ContextMenuTrigger, { size: "S", endIcon: null, paddingLeft: 2, paddingRight: 2, children: [
                  /* @__PURE__ */ jsx(More, { "aria-hidden": true, focusable: false }),
                  /* @__PURE__ */ jsx(VisuallyHidden, { tag: "span", children: formatMessage({
                    id: "[tbdb].components.DynamicZone.more-actions",
                    defaultMessage: "More actions"
                  }) })
                ] }),
                /* @__PURE__ */ jsx(Menu.Content, { popoverPlacement: "bottom-end", zIndex: 2, children: /* @__PURE__ */ jsxs(Menu.SubRoot, { children: [
                  canUpdate && /* @__PURE__ */ jsx(MenuItem, { onClick: handleCloneClick, children: formatMessage({
                    id: "Settings.review-workflows.stage.delete",
                    defaultMessage: "Duplicate stage"
                  }) }),
                  canDelete && /* @__PURE__ */ jsx(DeleteMenuItem, { onClick: () => removeFieldRow("stages", index), children: formatMessage({
                    id: "Settings.review-workflows.stage.delete",
                    defaultMessage: "Delete"
                  }) })
                ] }) })
              ] }),
              canUpdate && /* @__PURE__ */ jsx(
                IconButton,
                {
                  background: "transparent",
                  hasRadius: true,
                  variant: "ghost",
                  "data-handler-id": handlerId,
                  ref: dragRef,
                  label: formatMessage({
                    id: "Settings.review-workflows.stage.drag",
                    defaultMessage: "Drag"
                  }),
                  onClick: (e) => e.stopPropagation(),
                  onKeyDown: handleKeyDown,
                  children: /* @__PURE__ */ jsx(Drag, {})
                }
              )
            ] }) : null })
          ] }),
          /* @__PURE__ */ jsx(Accordion.Content, { children: /* @__PURE__ */ jsx(Grid.Root, { gap: 4, padding: 6, children: [
            {
              disabled: !canUpdate,
              label: formatMessage({
                id: "Settings.review-workflows.stage.name.label",
                defaultMessage: "Stage name"
              }),
              name: `stages.${index}.name`,
              required: true,
              size: 6,
              type: "string"
            },
            {
              disabled: !canUpdate,
              label: formatMessage({
                id: "content-manager.reviewWorkflows.stage.color",
                defaultMessage: "Color"
              }),
              name: `stages.${index}.color`,
              required: true,
              size: 6,
              type: "color"
            },
            {
              disabled: !canUpdate,
              label: formatMessage({
                id: "Settings.review-workflows.stage.permissions.label",
                defaultMessage: "Roles that can change this stage"
              }),
              name: `stages.${index}.permissions`,
              placeholder: formatMessage({
                id: "Settings.review-workflows.stage.permissions.placeholder",
                defaultMessage: "Select a role"
              }),
              required: true,
              size: 6,
              type: "permissions"
            }
          ].map(({ size, ...field }) => /* @__PURE__ */ jsx(Grid.Item, { col: size, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsx(InputRenderer, { ...field }) }, field.name)) }) })
        ] })
      }
    )
  ] });
};
const AccordionRoot = styled(Accordion.Root)`
  border: 1px solid
    ${({ theme, $error }) => $error ? theme.colors.danger600 : theme.colors.neutral200};
`;
const DeleteMenuItem = styled(MenuItem)`
  color: ${({ theme }) => theme.colors.danger600};
`;
const ContextMenuTrigger = styled(Menu.Trigger)`
  :hover,
  :focus {
    background-color: ${({ theme }) => theme.colors.neutral100};
  }

  > span {
    font-size: 0;
  }
`;
const InputRenderer = (props) => {
  switch (props.type) {
    case "color":
      return /* @__PURE__ */ jsx(ColorSelector, { ...props });
    case "permissions":
      return /* @__PURE__ */ jsx(PermissionsField, { ...props });
    default:
      return /* @__PURE__ */ jsx(InputRenderer$1, { ...props });
  }
};
const ColorSelector = ({ disabled, label, name, required }) => {
  const { formatMessage } = useIntl();
  const { value, error, onChange } = useField(name);
  const colorOptions = AVAILABLE_COLORS.map(({ hex, name: name2 }) => ({
    value: hex,
    label: formatMessage(
      {
        id: "Settings.review-workflows.stage.color.name",
        defaultMessage: "{name}"
      },
      { name: name2 }
    ),
    color: hex
  }));
  const { themeColorName } = getStageColorByHex(value) ?? {};
  return /* @__PURE__ */ jsxs(Field.Root, { error, name, required, children: [
    /* @__PURE__ */ jsx(Field.Label, { children: label }),
    /* @__PURE__ */ jsx(
      SingleSelect,
      {
        disabled,
        onChange: (v) => {
          onChange(name, v.toString());
        },
        value: value?.toUpperCase(),
        startIcon: /* @__PURE__ */ jsx(
          Flex,
          {
            tag: "span",
            height: 2,
            background: value,
            borderColor: themeColorName === "neutral0" ? "neutral150" : "transparent",
            hasRadius: true,
            shrink: 0,
            width: 2
          }
        ),
        children: colorOptions.map(({ value: value2, label: label2, color }) => {
          const { themeColorName: themeColorName2 } = getStageColorByHex(color) || {};
          return /* @__PURE__ */ jsx(
            SingleSelectOption,
            {
              value: value2,
              startIcon: /* @__PURE__ */ jsx(
                Flex,
                {
                  tag: "span",
                  height: 2,
                  background: color,
                  borderColor: themeColorName2 === "neutral0" ? "neutral150" : "transparent",
                  hasRadius: true,
                  shrink: 0,
                  width: 2
                }
              ),
              children: label2
            },
            value2
          );
        })
      }
    ),
    /* @__PURE__ */ jsx(Field.Error, {})
  ] });
};
const PermissionsField = ({ disabled, name, placeholder, required }) => {
  const { formatMessage } = useIntl();
  const { toggleNotification } = useNotification();
  const [isApplyAllConfirmationOpen, setIsApplyAllConfirmationOpen] = React.useState(false);
  const { value = [], error, onChange } = useField(name);
  const allStages = useForm("PermissionsField", (state) => state.values.stages);
  const onFormValueChange = useForm("PermissionsField", (state) => state.onChange);
  const rolesErrorCount = React.useRef(0);
  const { data: roles = [], isLoading, error: getRolesError } = useGetAdminRolesQuery();
  const filteredRoles = roles?.filter((role) => role.code !== "strapi-super-admin") ?? [];
  React.useEffect(() => {
    if (!isLoading && getRolesError && "status" in getRolesError && getRolesError.status == 403 && rolesErrorCount.current === 0) {
      rolesErrorCount.current = 1;
      toggleNotification({
        blockTransition: true,
        type: "danger",
        message: formatMessage({
          id: "review-workflows.stage.permissions.noPermissions.description",
          defaultMessage: "You don’t have the permission to see roles. Contact your administrator."
        })
      });
    }
  }, [formatMessage, isLoading, roles, toggleNotification, getRolesError]);
  if (!isLoading && filteredRoles.length === 0) {
    return /* @__PURE__ */ jsxs(
      Field.Root,
      {
        name,
        hint: formatMessage({
          id: "Settings.review-workflows.stage.permissions.noPermissions.description",
          defaultMessage: "You don’t have the permission to see roles"
        }),
        required,
        children: [
          /* @__PURE__ */ jsx(Field.Label, { children: formatMessage({
            id: "Settings.review-workflows.stage.permissions.label",
            defaultMessage: "Roles that can change this stage"
          }) }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              disabled: true,
              placeholder: formatMessage({
                id: "components.NotAllowedInput.text",
                defaultMessage: "No permissions to see this field"
              }),
              startAction: /* @__PURE__ */ jsx(EyeStriked, { fill: "neutral600" }),
              type: "text",
              value: ""
            }
          ),
          /* @__PURE__ */ jsx(Field.Hint, {})
        ]
      }
    );
  }
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(Flex, { alignItems: "flex-end", gap: 3, children: [
    /* @__PURE__ */ jsx(PermissionWrapper, { grow: 1, children: /* @__PURE__ */ jsxs(Field.Root, { error, name, required: true, children: [
      /* @__PURE__ */ jsx(Field.Label, { children: formatMessage({
        id: "Settings.review-workflows.stage.permissions.label",
        defaultMessage: "Roles that can change this stage"
      }) }),
      /* @__PURE__ */ jsx(
        MultiSelect,
        {
          disabled,
          onChange: (values) => {
            const permissions = values.map((value2) => ({
              role: parseInt(value2, 10),
              action: "admin::review-workflows.stage.transition"
            }));
            onChange(name, permissions);
          },
          placeholder,
          value: value.map((permission) => `${permission.role}`),
          withTags: true,
          children: /* @__PURE__ */ jsx(
            MultiSelectGroup,
            {
              label: formatMessage({
                id: "Settings.review-workflows.stage.permissions.allRoles.label",
                defaultMessage: "All roles"
              }),
              values: filteredRoles.map((r) => `${r.id}`),
              children: filteredRoles.map((role) => {
                return /* @__PURE__ */ jsx(NestedOption$1, { value: `${role.id}`, children: role.name }, role.id);
              })
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(Field.Error, {})
    ] }) }),
    /* @__PURE__ */ jsxs(Dialog.Root, { open: isApplyAllConfirmationOpen, onOpenChange: setIsApplyAllConfirmationOpen, children: [
      /* @__PURE__ */ jsx(Dialog.Trigger, { children: /* @__PURE__ */ jsx(
        IconButton,
        {
          disabled,
          label: formatMessage({
            id: "Settings.review-workflows.stage.permissions.apply.label",
            defaultMessage: "Apply to all stages"
          }),
          size: "L",
          children: /* @__PURE__ */ jsx(Duplicate, {})
        }
      ) }),
      /* @__PURE__ */ jsx(
        ConfirmDialog,
        {
          onConfirm: () => {
            onFormValueChange(
              "stages",
              allStages.map((stage) => ({
                ...stage,
                permissions: value
              }))
            );
            setIsApplyAllConfirmationOpen(false);
            toggleNotification({
              type: "success",
              message: formatMessage({
                id: "Settings.review-workflows.page.edit.confirm.stages.permissions.copy.success",
                defaultMessage: "Applied roles to all other stages of the workflow"
              })
            });
          },
          variant: "default",
          children: formatMessage({
            id: "Settings.review-workflows.page.edit.confirm.stages.permissions.copy",
            defaultMessage: "Roles that can change that stage will be applied to all the other stages."
          })
        }
      )
    ] })
  ] }) });
};
const NestedOption$1 = styled(MultiSelectOption)`
  padding-left: ${({ theme }) => theme.spaces[7]};
`;
const PermissionWrapper = styled(Flex)`
  > * {
    flex-grow: 1;
  }
`;
const WorkflowAttributes = ({ canUpdate = true }) => {
  const { formatMessage } = useIntl();
  return /* @__PURE__ */ jsxs(Grid.Root, { background: "neutral0", hasRadius: true, gap: 4, padding: 6, shadow: "tableShadow", children: [
    /* @__PURE__ */ jsx(Grid.Item, { col: 6, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsx(
      InputRenderer$1,
      {
        disabled: !canUpdate,
        label: formatMessage({
          id: "Settings.review-workflows.workflow.name.label",
          defaultMessage: "Workflow Name"
        }),
        name: "name",
        required: true,
        type: "string"
      }
    ) }),
    /* @__PURE__ */ jsx(Grid.Item, { col: 6, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsx(ContentTypesSelector, { disabled: !canUpdate }) }),
    /* @__PURE__ */ jsx(Grid.Item, { col: 6, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsx(StageSelector, { disabled: !canUpdate }) })
  ] });
};
const ContentTypesSelector = ({ disabled }) => {
  const { formatMessage, locale } = useIntl();
  const { data: contentTypes, isLoading } = useGetContentTypesQuery();
  const { workflows } = useReviewWorkflows();
  const currentWorkflow = useForm("ContentTypesSelector", (state) => state.values);
  const { error, value, onChange } = useField("contentTypes");
  const formatter = useCollator(locale, {
    sensitivity: "base"
  });
  const isDisabled = disabled || isLoading || !contentTypes || contentTypes.collectionType.length === 0 && contentTypes.singleType.length === 0;
  const collectionTypes = (contentTypes?.collectionType ?? []).toSorted((a, b) => formatter.compare(a.info.displayName, b.info.displayName)).map((contentType) => ({
    label: contentType.info.displayName,
    value: contentType.uid
  }));
  const singleTypes = (contentTypes?.singleType ?? []).map((contentType) => ({
    label: contentType.info.displayName,
    value: contentType.uid
  }));
  return /* @__PURE__ */ jsxs(Field.Root, { error, name: "contentTypes", children: [
    /* @__PURE__ */ jsx(Field.Label, { children: formatMessage({
      id: "Settings.review-workflows.workflow.contentTypes.label",
      defaultMessage: "Associated to"
    }) }),
    /* @__PURE__ */ jsx(
      MultiSelect,
      {
        customizeContent: (value2) => formatMessage(
          {
            id: "Settings.review-workflows.workflow.contentTypes.displayValue",
            defaultMessage: "{count} {count, plural, one {content type} other {content types}} selected"
          },
          { count: value2?.length }
        ),
        disabled: isDisabled,
        onChange: (values) => {
          onChange("contentTypes", values);
        },
        value,
        placeholder: formatMessage({
          id: "Settings.review-workflows.workflow.contentTypes.placeholder",
          defaultMessage: "Select"
        }),
        children: [
          ...collectionTypes.length > 0 ? [
            {
              label: formatMessage({
                id: "Settings.review-workflows.workflow.contentTypes.collectionTypes.label",
                defaultMessage: "Collection Types"
              }),
              children: collectionTypes
            }
          ] : [],
          ...singleTypes.length > 0 ? [
            {
              label: formatMessage({
                id: "Settings.review-workflows.workflow.contentTypes.singleTypes.label",
                defaultMessage: "Single Types"
              }),
              children: singleTypes
            }
          ] : []
        ].map((opt) => {
          return /* @__PURE__ */ jsx(
            MultiSelectGroup,
            {
              label: opt.label,
              values: opt.children.map((child) => child.value.toString()),
              children: opt.children.map((child) => {
                const { name: assignedWorkflowName } = workflows?.find(
                  (workflow) => (currentWorkflow && workflow.id !== currentWorkflow.id || !currentWorkflow) && workflow.contentTypes.includes(child.value)
                ) ?? {};
                return /* @__PURE__ */ jsx(NestedOption, { value: child.value, children: /* @__PURE__ */ jsx(Typography, {
                  // @ts-expect-error - formatMessage options doesn't expect to be a React component but that's what we need actually for the <i> and <em> components
                  children: formatMessage(
                    {
                      id: "Settings.review-workflows.workflow.contentTypes.assigned.notice",
                      defaultMessage: "{label} {name, select, undefined {} other {<i>(assigned to <em>{name}</em> workflow)</i>}}"
                    },
                    {
                      label: child.label,
                      name: assignedWorkflowName,
                      em: (...children) => /* @__PURE__ */ jsx(Typography, { tag: "em", fontWeight: "bold", children }),
                      i: (...children) => /* @__PURE__ */ jsx(ContentTypeTakeNotice, { children })
                    }
                  )
                }) }, child.value);
              })
            },
            opt.label
          );
        })
      }
    )
  ] });
};
const NestedOption = styled(MultiSelectOption)`
  padding-left: ${({ theme }) => theme.spaces[7]};
`;
const ContentTypeTakeNotice = styled(Typography)`
  font-style: italic;
`;
const StageSelector = ({ disabled }) => {
  const { value: stages = [] } = useField("stages");
  const { formatMessage } = useIntl();
  const { error, value, onChange } = useField("stageRequiredToPublish");
  const validStages = stages.filter((stage) => stage.name);
  return /* @__PURE__ */ jsxs(
    Field.Root,
    {
      error,
      name: "stageRequiredToPublish",
      hint: formatMessage({
        id: "settings.review-workflows.workflow.stageRequiredToPublish.hint",
        defaultMessage: "Prevents entries from being published if they are not at the required stage."
      }),
      children: [
        /* @__PURE__ */ jsx(Field.Label, { children: formatMessage({
          id: "settings.review-workflows.workflow.stageRequiredToPublish.label",
          defaultMessage: "Required stage for publishing"
        }) }),
        /* @__PURE__ */ jsxs(
          SingleSelect,
          {
            disabled,
            onChange: (value2) => {
              onChange("stageRequiredToPublish", value2);
            },
            value,
            children: [
              /* @__PURE__ */ jsx(SingleSelectOption, { value: "", children: formatMessage({
                id: "settings.review-workflows.workflow.stageRequiredToPublish.any",
                defaultMessage: "Any stage"
              }) }),
              validStages.map((stage, i) => /* @__PURE__ */ jsx(
                SingleSelectOption,
                {
                  value: stage.id?.toString() || stage.__temp_key__,
                  children: stage.name
                },
                `requiredToPublishStage-${stage.id || stage.__temp_key__}`
              ))
            ]
          }
        ),
        /* @__PURE__ */ jsx(Field.Hint, {})
      ]
    }
  );
};
const WORKFLOW_SCHEMA = yup.object({
  contentTypes: yup.array().of(yup.string()),
  name: yup.string().max(255, {
    id: "review-workflows.validation.name.max-length",
    defaultMessage: "Name can not be longer than 255 characters"
  }).required().nullable(),
  stages: yup.array().of(
    yup.object().shape({
      name: yup.string().nullable().required({
        id: "review-workflows.validation.stage.name",
        defaultMessage: "Name is required"
      }).max(255, {
        id: "review-workflows.validation.stage.max-length",
        defaultMessage: "Name can not be longer than 255 characters"
      }).test(
        "unique-name",
        {
          id: "review-workflows.validation.stage.duplicate",
          defaultMessage: "Stage name must be unique"
        },
        (stageName, context) => {
          const { stages } = context.from[1].value;
          return stages.filter((stage) => stage.name === stageName).length === 1;
        }
      ),
      color: yup.string().nullable().required({
        id: "review-workflows.validation.stage.color",
        defaultMessage: "Color is required"
      }).matches(/^#(?:[0-9a-fA-F]{3}){1,2}$/i),
      permissions: yup.array(
        yup.object({
          role: yup.number().strict().typeError({
            id: "review-workflows.validation.stage.permissions.role.number",
            defaultMessage: "Role must be of type number"
          }).required(),
          action: yup.string().required({
            id: "review-workflows.validation.stage.permissions.action.required",
            defaultMessage: "Action is a required argument"
          })
        })
      ).strict()
    })
  ).min(1),
  stageRequiredToPublish: yup.string().nullable()
});
const EditPage = () => {
  const { id = "" } = useParams();
  const isCreatingWorkflow = id === "create";
  const { formatMessage } = useIntl();
  const { _unstableFormatValidationErrors: formatValidationErrors } = useAPIErrorHandler();
  const navigate = useNavigate();
  const { toggleNotification } = useNotification();
  const {
    isLoading: isLoadingWorkflow,
    meta,
    workflows,
    error,
    update,
    create
  } = useReviewWorkflows();
  const permissions = useTypedSelector(
    (state) => state.admin_app.permissions["settings"]?.["review-workflows"]
  );
  const {
    allowedActions: { canDelete, canUpdate, canCreate }
  } = useRBAC(permissions);
  const [savePrompts, setSavePrompts] = React.useState({});
  const { getFeature, isLoading: isLicenseLoading } = useLicenseLimits();
  const [showLimitModal, setShowLimitModal] = React.useState(null);
  const currentWorkflow = workflows?.find((workflow) => workflow.id === parseInt(id, 10));
  const contentTypesFromOtherWorkflows = workflows?.filter((workflow) => workflow.id !== parseInt(id, 10)).flatMap((workflow) => workflow.contentTypes);
  const limits = getFeature("review-workflows");
  const numberOfWorkflows = limits?.[CHARGEBEE_WORKFLOW_ENTITLEMENT_NAME];
  const stagesPerWorkflow = limits?.[CHARGEBEE_STAGES_PER_WORKFLOW_ENTITLEMENT_NAME];
  const submitForm = async (data, helpers) => {
    try {
      const { stageRequiredToPublish, ...rest } = data;
      const stageRequiredToPublishName = stageRequiredToPublish === "" ? null : rest.stages.find(
        (stage) => stage.id === Number(stageRequiredToPublish) || stage.__temp_key__ === stageRequiredToPublish
      )?.name;
      if (!isCreatingWorkflow) {
        const res = await update(id, {
          ...rest,
          // compare permissions of stages and only submit them if at least one has
          // changed; this enables partial updates e.g. for users who don't have
          // permissions to see roles
          stages: rest.stages.map((stage) => {
            let hasUpdatedPermissions = true;
            const serverStage = currentWorkflow?.stages?.find(
              (serverStage2) => serverStage2.id === stage?.id
            );
            if (serverStage) {
              hasUpdatedPermissions = serverStage.permissions?.length !== stage.permissions?.length || !serverStage.permissions?.every(
                (serverPermission) => !!stage.permissions?.find(
                  (permission) => permission.role === serverPermission.role
                )
              );
            }
            return {
              ...stage,
              permissions: hasUpdatedPermissions ? stage.permissions : void 0
            };
          }),
          stageRequiredToPublishName
        });
        if ("error" in res && isBaseQueryError(res.error) && res.error.name === "ValidationError") {
          helpers.setErrors(formatValidationErrors(res.error));
        }
      } else {
        const res = await create({
          ...rest,
          stageRequiredToPublishName
        });
        if ("error" in res && isBaseQueryError(res.error) && res.error.name === "ValidationError") {
          helpers.setErrors(formatValidationErrors(res.error));
        } else if ("data" in res) {
          navigate(`../${res.data.id}`, { replace: true });
        }
      }
    } catch (error2) {
      toggleNotification({
        type: "danger",
        message: formatMessage({
          id: "notification.error",
          defaultMessage: "An error occurred"
        })
      });
    }
    setSavePrompts({});
  };
  const handleConfirmDeleteDialog = (data, helpers) => async () => {
    await submitForm(data, helpers);
  };
  const handleConfirmClose = () => {
    setSavePrompts({});
  };
  const handleSubmit = async (data, helpers) => {
    const isContentTypeReassignment = data.contentTypes.some(
      (contentType) => contentTypesFromOtherWorkflows?.includes(contentType)
    );
    const hasDeletedServerStages = !isCreatingWorkflow && !currentWorkflow?.stages.every(
      (stage) => data.stages.some((newStage) => newStage.id === stage.id)
    );
    if (meta && numberOfWorkflows && meta?.workflowCount > parseInt(numberOfWorkflows, 10)) {
      setShowLimitModal("workflow");
    } else if (data.stages && stagesPerWorkflow && data.stages.length > parseInt(stagesPerWorkflow, 10)) {
      setShowLimitModal("stage");
    } else if (hasDeletedServerStages || isContentTypeReassignment) {
      if (hasDeletedServerStages) {
        setSavePrompts((prev) => ({ ...prev, hasDeletedServerStages: true }));
      }
      if (isContentTypeReassignment) {
        setSavePrompts((prev) => ({ ...prev, hasReassignedContentTypes: true }));
      }
    } else {
      await submitForm(data, helpers);
    }
  };
  React.useEffect(() => {
    if (!isLoadingWorkflow && !isLicenseLoading) {
      if (meta && numberOfWorkflows && meta?.workflowCount > parseInt(numberOfWorkflows, 10)) {
        setShowLimitModal("workflow");
      } else if (currentWorkflow && currentWorkflow.stages && stagesPerWorkflow && currentWorkflow.stages.length > parseInt(stagesPerWorkflow, 10)) {
        setShowLimitModal("stage");
      }
    }
  }, [
    currentWorkflow,
    isLicenseLoading,
    isLoadingWorkflow,
    limits,
    meta,
    numberOfWorkflows,
    stagesPerWorkflow
  ]);
  const initialValues = React.useMemo(() => {
    if (isCreatingWorkflow || !currentWorkflow) {
      return {
        name: "",
        stages: [],
        contentTypes: [],
        stageRequiredToPublish: ""
      };
    } else {
      return {
        name: currentWorkflow.name,
        stages: addTmpKeysToStages(currentWorkflow.stages),
        contentTypes: currentWorkflow.contentTypes,
        stageRequiredToPublish: currentWorkflow.stageRequiredToPublish?.id.toString() ?? ""
      };
    }
  }, [currentWorkflow, isCreatingWorkflow]);
  if (isLoadingWorkflow) {
    return /* @__PURE__ */ jsx(Page.Loading, {});
  }
  if (error) {
    return /* @__PURE__ */ jsx(Page.Error, {});
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(DragLayerRendered, {}),
    /* @__PURE__ */ jsx(
      Form,
      {
        method: isCreatingWorkflow ? "POST" : "PUT",
        initialValues,
        validationSchema: WORKFLOW_SCHEMA,
        onSubmit: handleSubmit,
        children: ({ modified, isSubmitting, values, setErrors }) => /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            Header,
            {
              navigationAction: /* @__PURE__ */ jsx(BackButton, { fallback: ".." }),
              primaryAction: canUpdate || canCreate ? /* @__PURE__ */ jsx(
                Button,
                {
                  startIcon: /* @__PURE__ */ jsx(Check, {}),
                  type: "submit",
                  disabled: !modified || isSubmitting || values.stages.length === 0,
                  loading: !Boolean(Object.keys(savePrompts).length > 0) && isSubmitting,
                  children: formatMessage({
                    id: "global.save",
                    defaultMessage: "Save"
                  })
                }
              ) : null,
              subtitle: formatMessage(
                {
                  id: "review-workflows.page.subtitle",
                  defaultMessage: "{count, plural, one {# stage} other {# stages}}"
                },
                { count: currentWorkflow?.stages?.length ?? 0 }
              ),
              title: currentWorkflow?.name || formatMessage({
                id: "Settings.review-workflows.create.page.title",
                defaultMessage: "Create Review Workflow"
              })
            }
          ),
          /* @__PURE__ */ jsx(Root, { children: /* @__PURE__ */ jsxs(Flex, { alignItems: "stretch", direction: "column", gap: 7, children: [
            /* @__PURE__ */ jsx(WorkflowAttributes, { canUpdate: canUpdate || canCreate }),
            /* @__PURE__ */ jsx(
              Stages,
              {
                canDelete,
                canUpdate: canUpdate || canCreate,
                isCreating: isCreatingWorkflow
              }
            )
          ] }) }),
          /* @__PURE__ */ jsx(
            Dialog.Root,
            {
              open: Object.keys(savePrompts).length > 0,
              onOpenChange: handleConfirmClose,
              children: /* @__PURE__ */ jsx(ConfirmDialog, { onConfirm: handleConfirmDeleteDialog(values, { setErrors }), children: /* @__PURE__ */ jsxs(Flex, { direction: "column", gap: 5, children: [
                savePrompts.hasDeletedServerStages && /* @__PURE__ */ jsx(Typography, { textAlign: "center", variant: "omega", children: formatMessage({
                  id: "review-workflows.page.delete.confirm.stages.body",
                  defaultMessage: "All entries assigned to deleted stages will be moved to the previous stage."
                }) }),
                savePrompts.hasReassignedContentTypes && /* @__PURE__ */ jsx(Typography, { textAlign: "center", variant: "omega", children: formatMessage(
                  {
                    id: "review-workflows.page.delete.confirm.contentType.body",
                    defaultMessage: "{count} {count, plural, one {content-type} other {content-types}} {count, plural, one {is} other {are}} already mapped to {count, plural, one {another workflow} other {other workflows}}. If you save changes, {count, plural, one {this} other {these}} {count, plural, one {content-type} other {{count} content-types}} will no more be mapped to the {count, plural, one {another workflow} other {other workflows}} and all corresponding information will be removed."
                  },
                  {
                    count: contentTypesFromOtherWorkflows?.filter(
                      (contentType) => values.contentTypes.includes(contentType)
                    ).length ?? 0
                  }
                ) }),
                /* @__PURE__ */ jsx(Typography, { textAlign: "center", variant: "omega", children: formatMessage({
                  id: "review-workflows.page.delete.confirm.confirm",
                  defaultMessage: "Are you sure you want to save?"
                }) })
              ] }) })
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxs(
      LimitsModal.Root,
      {
        open: showLimitModal === "workflow",
        onOpenChange: () => setShowLimitModal(null),
        children: [
          /* @__PURE__ */ jsx(LimitsModal.Title, { children: formatMessage({
            id: "review-workflows.edit.page.workflows.limit.title",
            defaultMessage: "You’ve reached the limit of workflows in your plan"
          }) }),
          /* @__PURE__ */ jsx(LimitsModal.Body, { children: formatMessage({
            id: "review-workflows.edit.page.workflows.limit.body",
            defaultMessage: "Delete a workflow or contact Sales to enable more workflows."
          }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      LimitsModal.Root,
      {
        open: showLimitModal === "stage",
        onOpenChange: () => setShowLimitModal(null),
        children: [
          /* @__PURE__ */ jsx(LimitsModal.Title, { children: formatMessage({
            id: "review-workflows.edit.page.stages.limit.title",
            defaultMessage: "You have reached the limit of stages for this workflow in your plan"
          }) }),
          /* @__PURE__ */ jsx(LimitsModal.Body, { children: formatMessage({
            id: "review-workflows.edit.page.stages.limit.body",
            defaultMessage: "Try deleting some stages or contact Sales to enable more stages."
          }) })
        ]
      }
    )
  ] });
};
const addTmpKeysToStages = (data) => {
  const keys = generateNKeysBetween(void 0, void 0, data.length);
  return data.map((datum, index) => ({
    ...datum,
    __temp_key__: keys[index]
  }));
};
const ProtectedEditPage = () => {
  const permissions = useTypedSelector((state) => {
    const {
      create = [],
      update = [],
      read = []
    } = state.admin_app.permissions.settings?.["review-workflows"] ?? {};
    return [...create, ...update, ...read];
  });
  return /* @__PURE__ */ jsx(Page.Protect, { permissions, children: /* @__PURE__ */ jsx(EditPage, {}) });
};
export {
  ProtectedEditPage
};
//# sourceMappingURL=id-FuGqdNs8.mjs.map
