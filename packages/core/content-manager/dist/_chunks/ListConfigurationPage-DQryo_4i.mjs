import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useForm, Layouts, BackButton, InputRenderer, useNotification, useField, Form, useTracking, useAPIErrorHandler, Page } from "@strapi/admin/strapi-admin";
import { Button, useCollator, Flex, Typography, Grid, Modal, Box, useComposedRefs, Menu, VisuallyHidden, Main, Divider } from "@strapi/design-system";
import { useIntl } from "react-intl";
import { useParams, Navigate } from "react-router-dom";
import { C as COLLECTION_TYPES, g as getTranslation, y as capitalise, c as useDoc, p as useGetContentTypeConfigurationQuery, v as checkIfAttributeIsDisplayable, o as useDocLayout, z as useUpdateContentTypeConfigurationMutation, S as SINGLE_TYPES } from "./index-ByPZ754U.mjs";
import { u as useTypedSelector } from "./hooks-E5u1mcgM.mjs";
import { s as setIn } from "./objects-D6yBsdmx.mjs";
import { Drag, Pencil, Cross, Plus } from "@strapi/icons";
import { getEmptyImage } from "react-dnd-html5-backend";
import { styled } from "styled-components";
import { C as CardDragPreview } from "./CardDragPreview-DOxamsuj.mjs";
import { u as useDragAndDrop, I as ItemTypes } from "./useDragAndDrop-DJ6jqvZN.mjs";
import * as yup from "yup";
import { F as FieldTypeIcon } from "./FieldTypeIcon-CMlNO8PE.mjs";
const Header = ({ name }) => {
  const { formatMessage } = useIntl();
  const params = useParams();
  const modified = useForm("Header", (state) => state.modified);
  const isSubmitting = useForm("Header", (state) => state.isSubmitting);
  return /* @__PURE__ */ jsx(
    Layouts.Header,
    {
      navigationAction: /* @__PURE__ */ jsx(BackButton, { fallback: `../${COLLECTION_TYPES}/${params.slug}` }),
      primaryAction: /* @__PURE__ */ jsx(Button, { size: "S", disabled: !modified, type: "submit", loading: isSubmitting, children: formatMessage({ id: "global.save", defaultMessage: "Save" }) }),
      subtitle: formatMessage({
        id: getTranslation("components.SettingsViewWrapper.pluginHeader.description.list-settings"),
        defaultMessage: "Define the settings of the list view."
      }),
      title: formatMessage(
        {
          id: getTranslation("components.SettingsViewWrapper.pluginHeader.title"),
          defaultMessage: "Configure the view - {name}"
        },
        { name: capitalise(name) }
      )
    }
  );
};
const EXCLUDED_SORT_ATTRIBUTE_TYPES = [
  "media",
  "richtext",
  "dynamiczone",
  "relation",
  "component",
  "json",
  "blocks"
];
const Settings = () => {
  const { formatMessage, locale } = useIntl();
  const formatter = useCollator(locale, {
    sensitivity: "base"
  });
  const { schema } = useDoc();
  const layout = useForm("Settings", (state) => state.values.layout ?? []);
  const currentSortBy = useForm(
    "Settings",
    (state) => state.values.settings.defaultSortBy
  );
  const onChange = useForm("Settings", (state) => state.onChange);
  const sortOptions = React.useMemo(
    () => Object.values(layout).reduce((acc, field) => {
      if (schema && !EXCLUDED_SORT_ATTRIBUTE_TYPES.includes(schema.attributes[field.name].type)) {
        acc.push({
          value: field.name,
          label: typeof field.label !== "string" ? formatMessage(field.label) : field.label
        });
      }
      return acc;
    }, []),
    [formatMessage, layout, schema]
  );
  const sortOptionsSorted = sortOptions.sort((a, b) => formatter.compare(a.label, b.label));
  React.useEffect(() => {
    if (sortOptionsSorted.findIndex((opt) => opt.value === currentSortBy) === -1) {
      onChange("settings.defaultSortBy", sortOptionsSorted[0]?.value);
    }
  }, [currentSortBy, onChange, sortOptionsSorted]);
  const formLayout = React.useMemo(
    () => SETTINGS_FORM_LAYOUT.map(
      (row) => row.map((field) => {
        if (field.type === "enumeration") {
          return {
            ...field,
            hint: field.hint ? formatMessage(field.hint) : void 0,
            label: formatMessage(field.label),
            options: field.name === "settings.defaultSortBy" ? sortOptionsSorted : field.options
          };
        } else {
          return {
            ...field,
            hint: field.hint ? formatMessage(field.hint) : void 0,
            label: formatMessage(field.label)
          };
        }
      })
    ),
    [formatMessage, sortOptionsSorted]
  );
  return /* @__PURE__ */ jsxs(Flex, { direction: "column", alignItems: "stretch", gap: 4, children: [
    /* @__PURE__ */ jsx(Typography, { variant: "delta", tag: "h2", children: formatMessage({
      id: getTranslation("containers.SettingPage.settings"),
      defaultMessage: "Settings"
    }) }),
    /* @__PURE__ */ jsx(Grid.Root, { gap: 4, children: formLayout.map(
      (row) => row.map(({ size, ...field }) => /* @__PURE__ */ jsx(Grid.Item, { s: 12, col: size, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsx(InputRenderer, { ...field }) }, field.name))
    ) }, "bottom")
  ] });
};
const SETTINGS_FORM_LAYOUT = [
  [
    {
      label: {
        id: getTranslation("form.Input.search"),
        defaultMessage: "Enable search"
      },
      name: "settings.searchable",
      size: 4,
      type: "boolean"
    },
    {
      label: {
        id: getTranslation("form.Input.filters"),
        defaultMessage: "Enable filters"
      },
      name: "settings.filterable",
      size: 4,
      type: "boolean"
    },
    {
      label: {
        id: getTranslation("form.Input.bulkActions"),
        defaultMessage: "Enable bulk actions"
      },
      name: "settings.bulkable",
      size: 4,
      type: "boolean"
    }
  ],
  [
    {
      hint: {
        id: getTranslation("form.Input.pageEntries.inputDescription"),
        defaultMessage: "Note: You can override this value in the Collection Type settings page."
      },
      label: {
        id: getTranslation("form.Input.pageEntries"),
        defaultMessage: "Entries per page"
      },
      name: "settings.pageSize",
      options: ["10", "20", "50", "100"].map((value) => ({ value, label: value })),
      size: 6,
      type: "enumeration"
    },
    {
      label: {
        id: getTranslation("form.Input.defaultSort"),
        defaultMessage: "Default sort attribute"
      },
      name: "settings.defaultSortBy",
      options: [],
      size: 3,
      type: "enumeration"
    },
    {
      label: {
        id: getTranslation("form.Input.sort.order"),
        defaultMessage: "Default sort order"
      },
      name: "settings.defaultSortOrder",
      options: ["ASC", "DESC"].map((value) => ({ value, label: value })),
      size: 3,
      type: "enumeration"
    }
  ]
];
const FIELD_SCHEMA = yup.object().shape({
  label: yup.string().required(),
  sortable: yup.boolean()
});
const EditFieldForm = ({ attribute, name, onClose }) => {
  const { formatMessage } = useIntl();
  const { toggleNotification } = useNotification();
  const { value, onChange } = useField(name);
  if (!value) {
    console.error(
      "You've opened a field to edit without it being part of the form, this is likely a bug with Strapi. Please open an issue."
    );
    toggleNotification({
      message: formatMessage({
        id: "content-manager.containers.list-settings.modal-form.error",
        defaultMessage: "An error occurred while trying to open the form."
      }),
      type: "danger"
    });
    return null;
  }
  let shouldDisplaySortToggle = !["media", "relation"].includes(attribute.type);
  if ("relation" in attribute && ["oneWay", "oneToOne", "manyToOne"].includes(attribute.relation)) {
    shouldDisplaySortToggle = true;
  }
  return /* @__PURE__ */ jsx(Modal.Content, { children: /* @__PURE__ */ jsxs(
    Form,
    {
      method: "PUT",
      initialValues: value,
      validationSchema: FIELD_SCHEMA,
      onSubmit: (data) => {
        onChange(name, data);
        onClose();
      },
      children: [
        /* @__PURE__ */ jsx(Modal.Header, { children: /* @__PURE__ */ jsxs(HeaderContainer, { children: [
          /* @__PURE__ */ jsx(FieldTypeIcon, { type: attribute.type }),
          /* @__PURE__ */ jsx(Modal.Title, { children: formatMessage(
            {
              id: getTranslation("containers.list-settings.modal-form.label"),
              defaultMessage: "Edit {fieldName}"
            },
            { fieldName: capitalise(value.label) }
          ) })
        ] }) }),
        /* @__PURE__ */ jsx(Modal.Body, { children: /* @__PURE__ */ jsx(Grid.Root, { gap: 4, children: [
          {
            name: "label",
            label: formatMessage({
              id: getTranslation("form.Input.label"),
              defaultMessage: "Label"
            }),
            hint: formatMessage({
              id: getTranslation("form.Input.label.inputDescription"),
              defaultMessage: "This value overrides the label displayed in the table's head"
            }),
            size: 6,
            type: "string"
          },
          {
            label: formatMessage({
              id: getTranslation("form.Input.sort.field"),
              defaultMessage: "Enable sort on this field"
            }),
            name: "sortable",
            size: 6,
            type: "boolean"
          }
        ].filter(
          (field) => field.name !== "sortable" || field.name === "sortable" && shouldDisplaySortToggle
        ).map(({ size, ...field }) => /* @__PURE__ */ jsx(
          Grid.Item,
          {
            s: 12,
            col: size,
            direction: "column",
            alignItems: "stretch",
            children: /* @__PURE__ */ jsx(InputRenderer, { ...field })
          },
          field.name
        )) }) }),
        /* @__PURE__ */ jsxs(Modal.Footer, { children: [
          /* @__PURE__ */ jsx(Button, { onClick: onClose, variant: "tertiary", children: formatMessage({ id: "app.components.Button.cancel", defaultMessage: "Cancel" }) }),
          /* @__PURE__ */ jsx(Button, { type: "submit", children: formatMessage({ id: "global.finish", defaultMessage: "Finish" }) })
        ] })
      ]
    }
  ) });
};
const HeaderContainer = styled(Flex)`
  svg {
    width: 3.2rem;
    margin-right: ${({ theme }) => theme.spaces[3]};
  }
`;
const DraggableCard = ({
  attribute,
  index,
  isDraggingSibling,
  label,
  name,
  onMoveField,
  onRemoveField,
  setIsDraggingSibling
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { formatMessage } = useIntl();
  const [, forceRerenderAfterDnd] = React.useState(false);
  const [{ isDragging }, objectRef, dropRef, dragRef, dragPreviewRef] = useDragAndDrop(true, {
    type: ItemTypes.FIELD,
    item: { index, label, name },
    index,
    onMoveItem: onMoveField,
    onEnd: () => setIsDraggingSibling(false)
  });
  React.useEffect(() => {
    dragPreviewRef(getEmptyImage(), { captureDraggingState: false });
  }, [dragPreviewRef]);
  React.useEffect(() => {
    if (isDragging) {
      setIsDraggingSibling(true);
    }
  }, [isDragging, setIsDraggingSibling]);
  React.useEffect(() => {
    if (!isDraggingSibling) {
      forceRerenderAfterDnd((prev) => !prev);
    }
  }, [isDraggingSibling]);
  const composedRefs = useComposedRefs(
    dropRef,
    objectRef
  );
  return /* @__PURE__ */ jsxs(FieldWrapper, { ref: composedRefs, children: [
    isDragging && /* @__PURE__ */ jsx(CardDragPreview, { label }),
    !isDragging && isDraggingSibling && /* @__PURE__ */ jsx(CardDragPreview, { isSibling: true, label }),
    !isDragging && !isDraggingSibling && /* @__PURE__ */ jsxs(
      FieldContainer,
      {
        borderColor: "neutral150",
        background: "neutral100",
        hasRadius: true,
        justifyContent: "space-between",
        onClick: () => setIsModalOpen(true),
        children: [
          /* @__PURE__ */ jsxs(Flex, { gap: 3, children: [
            /* @__PURE__ */ jsx(
              DragButton,
              {
                ref: dragRef,
                "aria-label": formatMessage(
                  {
                    id: getTranslation("components.DraggableCard.move.field"),
                    defaultMessage: "Move {item}"
                  },
                  { item: label }
                ),
                onClick: (e) => e.stopPropagation(),
                children: /* @__PURE__ */ jsx(Drag, {})
              }
            ),
            /* @__PURE__ */ jsx(Typography, { fontWeight: "bold", children: label })
          ] }),
          /* @__PURE__ */ jsxs(Flex, { paddingLeft: 3, onClick: (e) => e.stopPropagation(), children: [
            /* @__PURE__ */ jsxs(Modal.Root, { open: isModalOpen, onOpenChange: setIsModalOpen, children: [
              /* @__PURE__ */ jsx(Modal.Trigger, { children: /* @__PURE__ */ jsx(
                ActionButton,
                {
                  onClick: (e) => {
                    e.stopPropagation();
                  },
                  "aria-label": formatMessage(
                    {
                      id: getTranslation("components.DraggableCard.edit.field"),
                      defaultMessage: "Edit {item}"
                    },
                    { item: label }
                  ),
                  type: "button",
                  children: /* @__PURE__ */ jsx(Pencil, { width: "1.2rem", height: "1.2rem" })
                }
              ) }),
              /* @__PURE__ */ jsx(
                EditFieldForm,
                {
                  attribute,
                  name: `layout.${index}`,
                  onClose: () => {
                    setIsModalOpen(false);
                  }
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              ActionButton,
              {
                onClick: onRemoveField,
                "data-testid": `delete-${name}`,
                "aria-label": formatMessage(
                  {
                    id: getTranslation("components.DraggableCard.delete.field"),
                    defaultMessage: "Delete {item}"
                  },
                  { item: label }
                ),
                type: "button",
                children: /* @__PURE__ */ jsx(Cross, { width: "1.2rem", height: "1.2rem" })
              }
            )
          ] })
        ]
      }
    )
  ] });
};
const ActionButton = styled.button`
  display: flex;
  align-items: center;
  height: ${({ theme }) => theme.spaces[7]};
  color: ${({ theme }) => theme.colors.neutral600};

  &:hover {
    color: ${({ theme }) => theme.colors.neutral700};
  }

  &:last-child {
    padding: 0 ${({ theme }) => theme.spaces[3]};
  }
`;
const DragButton = styled(ActionButton)`
  padding: 0 ${({ theme }) => theme.spaces[3]};
  border-right: 1px solid ${({ theme }) => theme.colors.neutral150};
  cursor: all-scroll;
`;
const FieldContainer = styled(Flex)`
  max-height: 3.2rem;
  cursor: pointer;
`;
const FieldWrapper = styled(Box)`
  &:last-child {
    padding-right: ${({ theme }) => theme.spaces[3]};
  }
`;
const SortDisplayedFields = () => {
  const { formatMessage } = useIntl();
  const { model, schema } = useDoc();
  const [isDraggingSibling, setIsDraggingSibling] = React.useState(false);
  const [lastAction, setLastAction] = React.useState(null);
  const scrollableContainerRef = React.useRef(null);
  const values = useForm(
    "SortDisplayedFields",
    (state) => state.values.layout ?? []
  );
  const addFieldRow = useForm("SortDisplayedFields", (state) => state.addFieldRow);
  const removeFieldRow = useForm("SortDisplayedFields", (state) => state.removeFieldRow);
  const moveFieldRow = useForm("SortDisplayedFields", (state) => state.moveFieldRow);
  const { metadata: allMetadata } = useGetContentTypeConfigurationQuery(model, {
    selectFromResult: ({ data }) => ({ metadata: data?.contentType.metadatas ?? {} })
  });
  const nonDisplayedFields = React.useMemo(() => {
    if (!schema) {
      return [];
    }
    const displayedFieldNames = values.map((field) => field.name);
    return Object.entries(schema.attributes).reduce(
      (acc, [name, attribute]) => {
        if (!displayedFieldNames.includes(name) && checkIfAttributeIsDisplayable(attribute)) {
          const { list: metadata } = allMetadata[name];
          acc.push({
            name,
            label: metadata.label || name,
            sortable: metadata.sortable
          });
        }
        return acc;
      },
      []
    );
  }, [allMetadata, values, schema]);
  const handleAddField = (field) => {
    setLastAction("add");
    addFieldRow("layout", field);
  };
  const handleRemoveField = (index) => {
    setLastAction("remove");
    removeFieldRow("layout", index);
  };
  const handleMoveField = (dragIndex, hoverIndex) => {
    moveFieldRow("layout", dragIndex, hoverIndex);
  };
  React.useEffect(() => {
    if (lastAction === "add" && scrollableContainerRef?.current) {
      scrollableContainerRef.current.scrollLeft = scrollableContainerRef.current.scrollWidth;
    }
  }, [lastAction]);
  return /* @__PURE__ */ jsxs(Flex, { alignItems: "stretch", direction: "column", gap: 4, children: [
    /* @__PURE__ */ jsx(Typography, { variant: "delta", tag: "h2", children: formatMessage({
      id: getTranslation("containers.SettingPage.view"),
      defaultMessage: "View"
    }) }),
    /* @__PURE__ */ jsxs(Flex, { padding: 4, borderColor: "neutral300", borderStyle: "dashed", borderWidth: "1px", hasRadius: true, children: [
      /* @__PURE__ */ jsx(Box, { flex: "1", overflow: "auto hidden", ref: scrollableContainerRef, children: /* @__PURE__ */ jsx(Flex, { gap: 3, children: values.map((field, index) => /* @__PURE__ */ jsx(
        DraggableCard,
        {
          index,
          isDraggingSibling,
          onMoveField: handleMoveField,
          onRemoveField: () => handleRemoveField(index),
          setIsDraggingSibling,
          ...field,
          attribute: schema.attributes[field.name],
          label: typeof field.label === "object" ? formatMessage(field.label) : field.label
        },
        field.name
      )) }) }),
      /* @__PURE__ */ jsxs(Menu.Root, { children: [
        /* @__PURE__ */ jsxs(
          Menu.Trigger,
          {
            paddingLeft: 2,
            paddingRight: 2,
            justifyContent: "center",
            endIcon: null,
            disabled: nonDisplayedFields.length === 0,
            variant: "tertiary",
            children: [
              /* @__PURE__ */ jsx(VisuallyHidden, { tag: "span", children: formatMessage({
                id: getTranslation("components.FieldSelect.label"),
                defaultMessage: "Add a field"
              }) }),
              /* @__PURE__ */ jsx(Plus, { "aria-hidden": true, focusable: false, style: { position: "relative", top: 2 } })
            ]
          }
        ),
        /* @__PURE__ */ jsx(Menu.Content, { children: nonDisplayedFields.map((field) => /* @__PURE__ */ jsx(Menu.Item, { onSelect: () => handleAddField(field), children: typeof field.label === "object" ? formatMessage(field.label) : field.label }, field.name)) })
      ] })
    ] })
  ] });
};
const ListConfiguration = () => {
  const { formatMessage } = useIntl();
  const { trackUsage } = useTracking();
  const { toggleNotification } = useNotification();
  const { _unstableFormatAPIError: formatAPIError } = useAPIErrorHandler();
  const { model, collectionType } = useDoc();
  const { isLoading: isLoadingLayout, list, edit } = useDocLayout();
  const [updateContentTypeConfiguration] = useUpdateContentTypeConfigurationMutation();
  const handleSubmit = async (data) => {
    try {
      trackUsage("willSaveContentTypeLayout");
      const layoutData = data.layout ?? [];
      const meta = Object.entries(edit.metadatas).reduce((acc, [name, editMeta]) => {
        const { mainField: _mainField, ...listMeta } = list.metadatas[name];
        const { label, sortable } = layoutData.find((field) => field.name === name) ?? {};
        acc[name] = {
          edit: editMeta,
          list: {
            ...listMeta,
            label: label || listMeta.label,
            sortable: sortable || listMeta.sortable
          }
        };
        return acc;
      }, {});
      const res = await updateContentTypeConfiguration({
        layouts: {
          edit: edit.layout.flatMap(
            (panel) => panel.map((row) => row.map(({ name, size }) => ({ name, size })))
          ),
          list: layoutData.map((field) => field.name)
        },
        settings: setIn(data.settings, "displayName", void 0),
        metadatas: meta,
        uid: model
      });
      if ("data" in res) {
        trackUsage("didEditListSettings");
        toggleNotification({
          type: "success",
          message: formatMessage({ id: "notification.success.saved", defaultMessage: "Saved" })
        });
      } else {
        toggleNotification({
          type: "danger",
          message: formatAPIError(res.error)
        });
      }
    } catch (err) {
      console.error(err);
      toggleNotification({
        type: "danger",
        message: formatMessage({ id: "notification.error", defaultMessage: "An error occurred" })
      });
    }
  };
  const initialValues = React.useMemo(() => {
    return {
      layout: list.layout.map(({ label, sortable, name }) => ({
        label: typeof label === "string" ? label : formatMessage(label),
        sortable,
        name
      })),
      settings: list.settings
    };
  }, [formatMessage, list.layout, list.settings]);
  if (collectionType === SINGLE_TYPES) {
    return /* @__PURE__ */ jsx(Navigate, { to: `/single-types/${model}` });
  }
  if (isLoadingLayout) {
    return /* @__PURE__ */ jsx(Page.Loading, {});
  }
  return /* @__PURE__ */ jsxs(Layouts.Root, { children: [
    /* @__PURE__ */ jsx(Page.Title, { children: `Configure ${list.settings.displayName} List View` }),
    /* @__PURE__ */ jsx(Main, { children: /* @__PURE__ */ jsxs(Form, { initialValues, onSubmit: handleSubmit, method: "PUT", children: [
      /* @__PURE__ */ jsx(
        Header,
        {
          collectionType,
          model,
          name: list.settings.displayName ?? ""
        }
      ),
      /* @__PURE__ */ jsx(Layouts.Content, { children: /* @__PURE__ */ jsxs(
        Flex,
        {
          alignItems: "stretch",
          background: "neutral0",
          direction: "column",
          gap: 6,
          hasRadius: true,
          shadow: "tableShadow",
          paddingTop: 6,
          paddingBottom: 6,
          paddingLeft: 7,
          paddingRight: 7,
          children: [
            /* @__PURE__ */ jsx(Settings, {}),
            /* @__PURE__ */ jsx(Divider, {}),
            /* @__PURE__ */ jsx(SortDisplayedFields, {})
          ]
        }
      ) })
    ] }) })
  ] });
};
const ProtectedListConfiguration = () => {
  const permissions = useTypedSelector(
    (state) => state.admin_app.permissions.contentManager?.collectionTypesConfigurations
  );
  return /* @__PURE__ */ jsx(Page.Protect, { permissions, children: /* @__PURE__ */ jsx(ListConfiguration, {}) });
};
export {
  ListConfiguration,
  ProtectedListConfiguration
};
//# sourceMappingURL=ListConfigurationPage-DQryo_4i.mjs.map
