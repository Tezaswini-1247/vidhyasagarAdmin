import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import * as React from 'react';
import { Flex, Box, Checkbox, Typography, Button, Modal, Breadcrumbs, Crumb, MultiSelectNested, Accordion, Grid, Tabs } from '@strapi/design-system';
import { produce } from 'immer';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';
import { useIntl } from 'react-intl';
import { t as isObject$1, v as capitalise } from './Theme-DQRUlj-X.mjs';
import { createContext } from '@radix-ui/react-context';
import isEqual from 'lodash/isEqual';
import isObject from 'lodash/isObject';
import transform from 'lodash/transform';
import merge from 'lodash/merge';
import groupBy from 'lodash/groupBy';
import omit from 'lodash/omit';
import { CaretDown, Cog, ChevronUp, ChevronDown } from '@strapi/icons';
import { styled, css } from 'styled-components';
import upperFirst from 'lodash/upperFirst';

const [PermissionsDataManagerProvider, usePermissionsDataManagerContext] = createContext("PermissionsDataManager");
const usePermissionsDataManager = () => usePermissionsDataManagerContext("usePermissionsDataManager");

function difference(object, base) {
  function changes(object2, base2) {
    return transform(object2, (result, value, key) => {
      if (!isEqual(value, base2[key])) {
        result[key] = isObject(value) && isObject(base2[key]) ? changes(value, base2[key]) : value;
      }
      return result;
    });
  }
  return changes(object, base);
}

const flattenDeep = (array) => {
  if (Array.isArray(array)) {
    return array.reduce(
      (acc, value) => {
        if (Array.isArray(value)) {
          acc.push(...flattenDeep(value));
        } else {
          acc.push(value);
        }
        return acc;
      },
      []
    );
  } else {
    return [];
  }
};

const createArrayOfValues = (obj) => {
  if (!isObject$1(obj)) {
    return [];
  }
  return flattenDeep(
    Object.values(obj).map((value) => {
      if (isObject$1(value)) {
        return createArrayOfValues(value);
      }
      return value;
    })
  );
};

const findMatchingPermission = (permissions, action, subject) => permissions.find((perm) => perm.action === action && perm.subject === subject);
const formatPermissionsForAPI = (modifiedData) => {
  const pluginsPermissions = formatSettingsPermissions(modifiedData.plugins);
  const settingsPermissions = formatSettingsPermissions(modifiedData.settings);
  const collectionTypesPermissions = formatContentTypesPermissions(modifiedData.collectionTypes);
  const singleTypesPermissions = formatContentTypesPermissions(modifiedData.singleTypes);
  return [
    ...pluginsPermissions,
    ...settingsPermissions,
    ...collectionTypesPermissions,
    ...singleTypesPermissions
  ];
};
const formatSettingsPermissions = (settingsPermissionsObject) => {
  return Object.values(settingsPermissionsObject).reduce((formAcc, form) => {
    const currentCategoryPermissions = Object.values(form).reduce(
      (childFormAcc, childForm) => {
        const permissions = Object.entries(childForm).reduce(
          (responsesAcc, [
            actionName,
            {
              conditions,
              properties: { enabled }
            }
          ]) => {
            if (!enabled) {
              return responsesAcc;
            }
            responsesAcc.push({
              action: actionName,
              subject: null,
              conditions: createConditionsArray(conditions),
              properties: {}
            });
            return responsesAcc;
          },
          []
        );
        return [...childFormAcc, ...permissions];
      },
      []
    );
    return [...formAcc, ...currentCategoryPermissions];
  }, []);
};
const formatContentTypesPermissions = (contentTypesPermissions) => {
  const permissions = Object.entries(contentTypesPermissions).reduce(
    (allPermissions, current) => {
      const [subject, currentSubjectActions] = current;
      const permissions2 = Object.entries(currentSubjectActions).reduce(
        (acc, current2) => {
          const [actionName, permissions3] = current2;
          const shouldCreatePermission = createArrayOfValues(permissions3).some((val) => val);
          if (!shouldCreatePermission) {
            return acc;
          }
          if (!permissions3?.properties?.enabled) {
            const createdPermissionsArray = Object.entries(permissions3.properties).reduce(
              (acc2, current3) => {
                const [propertyName, propertyValue] = current3;
                acc2.properties[propertyName] = createPropertyArray(propertyValue);
                return acc2;
              },
              {
                action: actionName,
                subject,
                conditions: createConditionsArray(permissions3.conditions),
                properties: {}
              }
            );
            return [...acc, createdPermissionsArray];
          }
          if (!permissions3.properties.enabled) {
            return acc;
          }
          acc.push({
            action: actionName,
            subject,
            properties: {},
            conditions: createConditionsArray(permissions3.conditions)
          });
          return acc;
        },
        []
      );
      return [...allPermissions, ...permissions2];
    },
    []
  );
  return permissions;
};
const createPropertyArray = (propertyValue, prefix = "") => {
  return Object.entries(propertyValue).reduce((acc, current) => {
    const [name, value] = current;
    if (isObject$1(value)) {
      return [...acc, ...createPropertyArray(value, `${prefix}${name}.`)];
    }
    if (value && !isObject$1(value)) {
      acc.push(`${prefix}${name}`);
    }
    return acc;
  }, []);
};
const createConditionsArray = (conditions) => Object.entries(conditions).filter(([, conditionValue]) => {
  return conditionValue;
}).map(([conditionName]) => conditionName);

const createDefaultConditionsForm$1 = (conditions, initialConditions = []) => conditions.reduce((acc, current) => {
  acc[current.id] = initialConditions.indexOf(current.id) !== -1;
  return acc;
}, {});
const createDefaultForm = (layout, conditions, initialPermissions = []) => {
  return layout.reduce((acc, { categoryId, childrenForm }) => {
    const childrenDefaultForm = childrenForm.reduce((acc2, current) => {
      acc2[current.subCategoryId] = current.actions.reduce((acc3, current2) => {
        const foundMatchingPermission = findMatchingPermission(
          initialPermissions,
          current2.action,
          null
        );
        acc3[current2.action] = {
          properties: {
            enabled: foundMatchingPermission !== void 0
          },
          conditions: createDefaultConditionsForm$1(
            conditions,
            foundMatchingPermission?.conditions ?? []
          )
        };
        return acc3;
      }, {});
      return acc2;
    }, {});
    acc[categoryId] = childrenDefaultForm;
    return acc;
  }, {});
};
const createDefaultPropertiesForm = (properties, subject, matchingPermission) => {
  const recursivelyCreatePropertyForm = ({ children = [] }, propertyValues, prefix = "") => {
    return children.reduce((acc, current) => {
      if (current.children) {
        return {
          ...acc,
          [current.value]: recursivelyCreatePropertyForm(
            current,
            propertyValues,
            `${prefix}${current.value}.`
          )
        };
      }
      const hasProperty = propertyValues.indexOf(`${prefix}${current.value}`) !== -1;
      acc[current.value] = hasProperty;
      return acc;
    }, {});
  };
  return properties.reduce(
    (acc, currentPropertyName) => {
      const foundProperty = subject.properties.find(({ value }) => value === currentPropertyName);
      if (foundProperty) {
        const matchingPermissionPropertyValues = matchingPermission?.properties[foundProperty.value] ?? [];
        const propertyForm = recursivelyCreatePropertyForm(
          foundProperty,
          matchingPermissionPropertyValues
        );
        acc.properties[currentPropertyName] = propertyForm;
      }
      return acc;
    },
    { properties: {} }
  );
};
const createDefaultCTForm = ({ subjects, actions = [] }, conditions, initialPermissions = []) => {
  return actions.reduce((defaultForm, action) => {
    const subjectLayouts = action.subjects.reduce((acc, current) => {
      const foundLayout = subjects.find(({ uid }) => uid === current) || null;
      if (foundLayout) {
        acc[current] = foundLayout;
      }
      return acc;
    }, {});
    if (isEmpty(subjectLayouts)) {
      return defaultForm;
    }
    const contentTypesActions = Object.keys(subjectLayouts).reduce((acc, currentCTUID) => {
      const { actionId, applyToProperties } = action;
      const currentSubjectLayout = subjectLayouts[currentCTUID];
      const properties = currentSubjectLayout.properties.map(({ value }) => value);
      const doesNothaveProperty = properties.every(
        (property) => (applyToProperties || []).indexOf(property) === -1
      );
      const matchingPermission = findMatchingPermission(initialPermissions, actionId, currentCTUID);
      const conditionsForm = createDefaultConditionsForm$1(
        conditions,
        matchingPermission?.conditions ?? []
      );
      if (!acc[currentCTUID]) {
        acc[currentCTUID] = {};
      }
      if (isEmpty(applyToProperties) || doesNothaveProperty) {
        acc[currentCTUID][actionId] = {
          properties: {
            enabled: matchingPermission !== void 0
          },
          conditions: conditionsForm
        };
        return acc;
      }
      const propertiesForm = createDefaultPropertiesForm(
        applyToProperties,
        subjectLayouts[currentCTUID],
        matchingPermission
      );
      acc[currentCTUID][actionId] = { ...propertiesForm, conditions: conditionsForm };
      return acc;
    }, {});
    return merge(defaultForm, contentTypesActions);
  }, {});
};

const formatLayout = (layout, groupByKey) => {
  return Object.entries(groupBy(layout, groupByKey)).map(([itemName, item]) => ({
    category: itemName,
    categoryId: itemName.split(" ").join("-"),
    childrenForm: Object.entries(groupBy(item, "subCategory")).map(
      ([subCategoryName, actions]) => ({
        subCategoryName,
        subCategoryId: subCategoryName.split(" ").join("-"),
        actions
      })
    )
  }));
};

const updateConditionsToFalse = (obj) => {
  return Object.keys(obj).reduce((acc, current) => {
    const currentValue = obj[current];
    if (isObject$1(currentValue) && !has(currentValue, "conditions")) {
      return { ...acc, [current]: updateConditionsToFalse(currentValue) };
    }
    if (isObject$1(currentValue) && has(currentValue, "conditions")) {
      const isActionEnabled = createArrayOfValues(omit(currentValue, "conditions")).some(
        (val) => val
      );
      if (!isActionEnabled) {
        const updatedConditions = Object.keys(currentValue.conditions).reduce((acc1, current2) => {
          acc1[current2] = false;
          return acc1;
        }, {});
        return { ...acc, [current]: { ...currentValue, conditions: updatedConditions } };
      }
    }
    acc[current] = currentValue;
    return acc;
  }, {});
};

const updateValues = (obj, valueToSet, isFieldUpdate = false) => {
  return Object.keys(obj).reduce((acc, current) => {
    const currentValue = obj[current];
    if (current === "conditions" && !isFieldUpdate) {
      acc[current] = currentValue;
      return acc;
    }
    if (isObject$1(currentValue)) {
      return { ...acc, [current]: updateValues(currentValue, valueToSet, current === "fields") };
    }
    acc[current] = valueToSet;
    return acc;
  }, {});
};

const cellWidth = `12rem`;
const firstRowWidth = `20rem`;
const rowHeight = `5.3rem`;

const removeConditionKeyFromData = (obj) => {
  if (!obj) {
    return null;
  }
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (key !== "conditions") {
      acc[key] = value;
    }
    return acc;
  }, {});
};

const getCheckboxState = (dataObj) => {
  const dataWithoutCondition = removeConditionKeyFromData(dataObj);
  const arrayOfValues = createArrayOfValues(dataWithoutCondition);
  if (!arrayOfValues.length) {
    return { hasAllActionsSelected: false, hasSomeActionsSelected: false };
  }
  const hasAllActionsSelected = arrayOfValues.every((val) => val);
  const hasSomeActionsSelected = arrayOfValues.some((val) => val) && !hasAllActionsSelected;
  return { hasAllActionsSelected, hasSomeActionsSelected };
};

const CollapseLabel = styled(Flex)`
  padding-right: ${({ theme }) => theme.spaces[2]};
  overflow: hidden;
  flex: 1;
  ${({ $isCollapsable }) => $isCollapsable && "cursor: pointer;"}
`;

const HiddenAction = styled.div`
  width: ${cellWidth};
`;

const RequiredSign = () => /* @__PURE__ */ jsx(Box, { color: "danger700", paddingLeft: 1, children: "*" });

const RowLabelWithCheckbox = ({
  checkboxName = "",
  children,
  isActive = false,
  isCollapsable = false,
  isFormDisabled = false,
  label,
  onChange,
  onClick,
  someChecked = false,
  value
}) => {
  const { formatMessage } = useIntl();
  const collapseLabelProps = {
    title: label,
    alignItems: "center",
    $isCollapsable: isCollapsable
  };
  if (isCollapsable) {
    Object.assign(collapseLabelProps, {
      onClick,
      "aria-expanded": isActive,
      onKeyDown({ key }) {
        if (key === "Enter" || key === " ") {
          onClick();
        }
      },
      tabIndex: 0,
      role: "button"
    });
  }
  return /* @__PURE__ */ jsxs(Flex, { alignItems: "center", paddingLeft: 6, width: firstRowWidth, shrink: 0, children: [
    /* @__PURE__ */ jsx(Box, { paddingRight: 2, children: /* @__PURE__ */ jsx(
      Checkbox,
      {
        name: checkboxName,
        "aria-label": formatMessage(
          {
            id: `Settings.permissions.select-all-by-permission`,
            defaultMessage: "Select all {label} permissions"
          },
          { label }
        ),
        disabled: isFormDisabled,
        onCheckedChange: (value2) => onChange({
          target: {
            name: checkboxName,
            value: !!value2
          }
        }),
        checked: someChecked ? "indeterminate" : value
      }
    ) }),
    /* @__PURE__ */ jsxs(CollapseLabel, { ...collapseLabelProps, children: [
      /* @__PURE__ */ jsx(Typography, { ellipsis: true, children: label }),
      children
    ] })
  ] });
};

const CollapsePropertyMatrix = ({
  availableActions = [],
  childrenForm = [],
  isFormDisabled,
  label,
  pathToData,
  propertyName
}) => {
  const propertyActions = React.useMemo(
    () => availableActions.map((action) => {
      const isActionRelatedToCurrentProperty = Array.isArray(action.applyToProperties) && action.applyToProperties.indexOf(propertyName) !== -1 && action.isDisplayed;
      return { label: action.label, actionId: action.actionId, isActionRelatedToCurrentProperty };
    }),
    [availableActions, propertyName]
  );
  return /* @__PURE__ */ jsxs(Flex, { display: "inline-flex", direction: "column", alignItems: "stretch", minWidth: 0, children: [
    /* @__PURE__ */ jsx(Header, { label, headers: propertyActions }),
    /* @__PURE__ */ jsx(Box, { children: childrenForm.map(({ children: childrenForm2, label: label2, value, required }, i) => /* @__PURE__ */ jsx(
      ActionRow$1,
      {
        childrenForm: childrenForm2,
        label: label2,
        isFormDisabled,
        name: value,
        required,
        propertyActions,
        pathToData,
        propertyName,
        isOdd: i % 2 === 0
      },
      value
    )) })
  ] });
};
const ActionRow$1 = ({
  childrenForm = [],
  label,
  isFormDisabled = false,
  name,
  required = false,
  pathToData,
  propertyActions,
  propertyName,
  isOdd = false
}) => {
  const { formatMessage } = useIntl();
  const [rowToOpen, setRowToOpen] = React.useState(null);
  const {
    modifiedData,
    onChangeCollectionTypeLeftActionRowCheckbox,
    onChangeParentCheckbox,
    onChangeSimpleCheckbox
  } = usePermissionsDataManager();
  const isActive = rowToOpen === name;
  const recursiveChildren = React.useMemo(() => {
    if (!Array.isArray(childrenForm)) {
      return [];
    }
    return childrenForm;
  }, [childrenForm]);
  const isCollapsable = recursiveChildren.length > 0;
  const handleClick = React.useCallback(() => {
    if (isCollapsable) {
      setRowToOpen((prev) => {
        if (prev === name) {
          return null;
        }
        return name;
      });
    }
  }, [isCollapsable, name]);
  const handleChangeLeftRowCheckbox = ({
    target: { value }
  }) => {
    onChangeCollectionTypeLeftActionRowCheckbox(pathToData, propertyName, name, value);
  };
  const { hasAllActionsSelected, hasSomeActionsSelected } = React.useMemo(() => {
    return getRowLabelCheckboxState(propertyActions, modifiedData, pathToData, propertyName, name);
  }, [propertyActions, modifiedData, pathToData, propertyName, name]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Wrapper$1,
      {
        alignItems: "center",
        $isCollapsable: isCollapsable,
        $isActive: isActive,
        background: isOdd ? "neutral100" : "neutral0",
        children: /* @__PURE__ */ jsxs(Flex, { children: [
          /* @__PURE__ */ jsxs(
            RowLabelWithCheckbox,
            {
              onChange: handleChangeLeftRowCheckbox,
              onClick: handleClick,
              isCollapsable,
              isFormDisabled,
              label,
              someChecked: hasSomeActionsSelected,
              value: hasAllActionsSelected,
              isActive,
              children: [
                required && /* @__PURE__ */ jsx(RequiredSign, {}),
                /* @__PURE__ */ jsx(CarretIcon, { $isActive: isActive })
              ]
            }
          ),
          /* @__PURE__ */ jsx(Flex, { children: propertyActions.map(({ label: label2, isActionRelatedToCurrentProperty, actionId }) => {
            if (!isActionRelatedToCurrentProperty) {
              return /* @__PURE__ */ jsx(HiddenAction, {}, label2);
            }
            const checkboxName = [
              ...pathToData.split(".."),
              actionId,
              "properties",
              propertyName,
              name
            ];
            if (!isCollapsable) {
              const checkboxValue = get(modifiedData, checkboxName, false);
              return /* @__PURE__ */ jsx(
                Flex,
                {
                  width: cellWidth,
                  position: "relative",
                  justifyContent: "center",
                  alignItems: "center",
                  children: /* @__PURE__ */ jsx(
                    Checkbox,
                    {
                      disabled: isFormDisabled,
                      name: checkboxName.join(".."),
                      "aria-label": formatMessage(
                        {
                          id: `Settings.permissions.select-by-permission`,
                          defaultMessage: "Select {label} permission"
                        },
                        { label: `${name} ${label2}` }
                      ),
                      onCheckedChange: (value) => {
                        onChangeSimpleCheckbox({
                          target: {
                            name: checkboxName.join(".."),
                            value: !!value
                          }
                        });
                      },
                      checked: checkboxValue
                    }
                  )
                },
                actionId
              );
            }
            const data = get(modifiedData, checkboxName, {});
            const { hasAllActionsSelected: hasAllActionsSelected2, hasSomeActionsSelected: hasSomeActionsSelected2 } = getCheckboxState(data);
            return /* @__PURE__ */ jsx(
              Flex,
              {
                width: cellWidth,
                position: "relative",
                justifyContent: "center",
                alignItems: "center",
                children: /* @__PURE__ */ jsx(
                  Checkbox,
                  {
                    disabled: isFormDisabled,
                    name: checkboxName.join(".."),
                    onCheckedChange: (value) => {
                      onChangeParentCheckbox({
                        target: {
                          name: checkboxName.join(".."),
                          value: !!value
                        }
                      });
                    },
                    "aria-label": formatMessage(
                      {
                        id: `Settings.permissions.select-by-permission`,
                        defaultMessage: "Select {label} permission"
                      },
                      { label: `${name} ${label2}` }
                    ),
                    checked: hasSomeActionsSelected2 ? "indeterminate" : hasAllActionsSelected2
                  }
                )
              },
              label2
            );
          }) })
        ] })
      }
    ),
    isActive && /* @__PURE__ */ jsx(
      SubActionRow,
      {
        childrenForm: recursiveChildren,
        isFormDisabled,
        parentName: name,
        pathToDataFromActionRow: pathToData,
        propertyName,
        propertyActions,
        recursiveLevel: 0
      }
    )
  ] });
};
const getRowLabelCheckboxState = (propertyActions, modifiedData, pathToContentType, propertyToCheck, targetKey) => {
  const actionIds = propertyActions.reduce((acc, current) => {
    if (current.isActionRelatedToCurrentProperty) {
      acc.push(current.actionId);
    }
    return acc;
  }, []);
  const data = actionIds.reduce((acc, current) => {
    const mainData = get(
      modifiedData,
      [...pathToContentType.split(".."), current, "properties", propertyToCheck, targetKey],
      false
    );
    acc[current] = mainData;
    return acc;
  }, {});
  return getCheckboxState(data);
};
const Wrapper$1 = styled(Flex)`
  height: ${rowHeight};
  flex: 1;

  &:hover {
    ${({ $isCollapsable, theme }) => $isCollapsable && activeStyle(theme)}
  }

  ${({ $isCollapsable }) => $isCollapsable && `
      ${CarretIcon} {
        display: flex;
      }
  `}
  ${({ $isActive, theme }) => $isActive && activeStyle(theme)};
`;
const CarretIcon = styled(CaretDown)`
  display: none;

  svg {
    width: 1.4rem;
  }

  path {
    fill: ${({ theme }) => theme.colors.neutral200};
  }

  transform: rotate(${({ $isActive }) => $isActive ? "180" : "0"}deg);
  margin-left: ${({ theme }) => theme.spaces[2]};
`;
const SubActionRow = ({
  childrenForm = [],
  isFormDisabled,
  recursiveLevel,
  pathToDataFromActionRow,
  propertyActions,
  parentName,
  propertyName
}) => {
  const { formatMessage } = useIntl();
  const { modifiedData, onChangeParentCheckbox, onChangeSimpleCheckbox } = usePermissionsDataManager();
  const [rowToOpen, setRowToOpen] = React.useState(null);
  const handleClickToggleSubLevel = (name) => {
    setRowToOpen((prev) => {
      if (prev === name) {
        return null;
      }
      return name;
    });
  };
  const displayedRecursiveChildren = React.useMemo(() => {
    if (!rowToOpen) {
      return null;
    }
    return childrenForm.find(({ value }) => value === rowToOpen);
  }, [rowToOpen, childrenForm]);
  return /* @__PURE__ */ jsxs(Box, { paddingLeft: `3.2rem`, children: [
    /* @__PURE__ */ jsx(TopTimeline, {}),
    childrenForm.map(({ label, value, required, children: subChildrenForm }, index) => {
      const isVisible = index + 1 < childrenForm.length;
      const isArrayType = Array.isArray(subChildrenForm);
      const isActive = rowToOpen === value;
      return /* @__PURE__ */ jsxs(LeftBorderTimeline, { $isVisible: isVisible, children: [
        /* @__PURE__ */ jsxs(Flex, { height: rowHeight, children: [
          /* @__PURE__ */ jsx(StyledBox, { children: /* @__PURE__ */ jsx(
            Svg,
            {
              width: "20",
              height: "23",
              viewBox: "0 0 20 23",
              fill: "none",
              xmlns: "http://www.w3.org/2000/svg",
              $color: "primary200",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                  d: "M7.02477 14.7513C8.65865 17.0594 11.6046 18.6059 17.5596 18.8856C18.6836 18.9384 19.5976 19.8435 19.5976 20.9688V20.9688C19.5976 22.0941 18.6841 23.0125 17.5599 22.9643C10.9409 22.6805 6.454 20.9387 3.75496 17.1258C0.937988 13.1464 0.486328 7.39309 0.486328 0.593262H4.50974C4.50974 7.54693 5.06394 11.9813 7.02477 14.7513Z",
                  fill: "#D9D8FF"
                }
              )
            }
          ) }),
          /* @__PURE__ */ jsxs(Flex, { style: { flex: 1 }, children: [
            /* @__PURE__ */ jsx(RowStyle, { $level: recursiveLevel, $isActive: isActive, $isCollapsable: isArrayType, children: /* @__PURE__ */ jsxs(
              CollapseLabel,
              {
                alignItems: "center",
                $isCollapsable: isArrayType,
                ...isArrayType && {
                  onClick: () => handleClickToggleSubLevel(value),
                  "aria-expanded": isActive,
                  onKeyDown: ({ key }) => (key === "Enter" || key === " ") && handleClickToggleSubLevel(value),
                  tabIndex: 0,
                  role: "button"
                },
                title: label,
                children: [
                  /* @__PURE__ */ jsx(RowLabel, { ellipsis: true, children: label }),
                  required && /* @__PURE__ */ jsx(RequiredSign, {}),
                  /* @__PURE__ */ jsx(CarretIcon, { $isActive: isActive })
                ]
              }
            ) }),
            /* @__PURE__ */ jsx(Flex, { style: { flex: 1 }, children: propertyActions.map(
              ({ actionId, label: propertyLabel, isActionRelatedToCurrentProperty }) => {
                if (!isActionRelatedToCurrentProperty) {
                  return /* @__PURE__ */ jsx(HiddenAction, {}, actionId);
                }
                const checkboxName = [
                  ...pathToDataFromActionRow.split(".."),
                  actionId,
                  "properties",
                  propertyName,
                  ...parentName.split(".."),
                  value
                ];
                const checkboxValue = get(modifiedData, checkboxName, false);
                if (!subChildrenForm) {
                  return /* @__PURE__ */ jsx(
                    Flex,
                    {
                      position: "relative",
                      width: cellWidth,
                      justifyContent: "center",
                      alignItems: "center",
                      children: /* @__PURE__ */ jsx(
                        Checkbox,
                        {
                          disabled: isFormDisabled,
                          name: checkboxName.join(".."),
                          "aria-label": formatMessage(
                            {
                              id: `Settings.permissions.select-by-permission`,
                              defaultMessage: "Select {label} permission"
                            },
                            { label: `${parentName} ${label} ${propertyLabel}` }
                          ),
                          onCheckedChange: (value2) => {
                            onChangeSimpleCheckbox({
                              target: {
                                name: checkboxName.join(".."),
                                value: !!value2
                              }
                            });
                          },
                          checked: checkboxValue
                        }
                      )
                    },
                    propertyLabel
                  );
                }
                const { hasAllActionsSelected, hasSomeActionsSelected } = getCheckboxState(checkboxValue);
                return /* @__PURE__ */ jsx(
                  Flex,
                  {
                    position: "relative",
                    width: cellWidth,
                    justifyContent: "center",
                    alignItems: "center",
                    children: /* @__PURE__ */ jsx(
                      Checkbox,
                      {
                        disabled: isFormDisabled,
                        name: checkboxName.join(".."),
                        "aria-label": formatMessage(
                          {
                            id: `Settings.permissions.select-by-permission`,
                            defaultMessage: "Select {label} permission"
                          },
                          { label: `${parentName} ${label} ${propertyLabel}` }
                        ),
                        onCheckedChange: (value2) => {
                          onChangeParentCheckbox({
                            target: {
                              name: checkboxName.join(".."),
                              value: !!value2
                            }
                          });
                        },
                        checked: hasSomeActionsSelected ? "indeterminate" : hasAllActionsSelected
                      },
                      propertyLabel
                    )
                  },
                  propertyLabel
                );
              }
            ) })
          ] })
        ] }),
        displayedRecursiveChildren && isActive && /* @__PURE__ */ jsx(Box, { paddingBottom: 2, children: /* @__PURE__ */ jsx(
          SubActionRow,
          {
            isFormDisabled,
            parentName: `${parentName}..${value}`,
            pathToDataFromActionRow,
            propertyActions,
            propertyName,
            recursiveLevel: recursiveLevel + 1,
            childrenForm: displayedRecursiveChildren.children
          }
        ) })
      ] }, value);
    })
  ] });
};
const LeftBorderTimeline = styled(Box)`
  border-left: ${({ $isVisible, theme }) => $isVisible ? `4px solid ${theme.colors.primary200}` : "4px solid transparent"};
`;
const RowStyle = styled(Flex)`
  padding-left: ${({ theme }) => theme.spaces[4]};
  width: ${({ $level }) => 145 - $level * 36}px;

  &:hover {
    ${({ $isCollapsable, theme }) => $isCollapsable && activeStyle(theme)}
  }

  ${({ $isCollapsable }) => $isCollapsable && `
      ${CarretIcon} {
        display: flex;
      }
  `}
  ${({ $isActive, theme }) => $isActive && activeStyle(theme)};
`;
const RowLabel = styled(Typography)``;
const TopTimeline = styled.div`
  padding-top: ${({ theme }) => theme.spaces[2]};
  margin-top: ${({ theme }) => theme.spaces[2]};
  width: 0.4rem;
  background-color: ${({ theme }) => theme.colors.primary200};
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
`;
const StyledBox = styled(Box)`
  transform: translate(-4px, -12px);

  &:before {
    content: '';
    width: 0.4rem;
    height: 1.2rem;
    background: ${({ theme }) => theme.colors.primary200};
    display: block;
  }
`;
const Svg = styled.svg`
  position: relative;
  flex-shrink: 0;
  transform: translate(-0.5px, -1px);

  * {
    fill: ${({ theme, $color }) => theme.colors[$color]};
  }
`;
const Header = ({ headers = [], label }) => {
  const { formatMessage } = useIntl();
  return /* @__PURE__ */ jsxs(Flex, { children: [
    /* @__PURE__ */ jsx(Flex, { width: firstRowWidth, height: rowHeight, shrink: 0, alignItems: "center", paddingLeft: 6, children: /* @__PURE__ */ jsx(Typography, { variant: "sigma", textColor: "neutral500", children: formatMessage(
      {
        id: "Settings.roles.form.permission.property-label",
        defaultMessage: "{label} permissions"
      },
      { label }
    ) }) }),
    headers.map((header) => {
      if (!header.isActionRelatedToCurrentProperty) {
        return /* @__PURE__ */ jsx(Flex, { width: cellWidth, shrink: 0 }, header.label);
      }
      return /* @__PURE__ */ jsx(Flex, { width: cellWidth, shrink: 0, justifyContent: "center", children: /* @__PURE__ */ jsx(Typography, { variant: "sigma", textColor: "neutral500", children: formatMessage({
        id: `Settings.roles.form.permissions.${header.label.toLowerCase()}`,
        defaultMessage: header.label
      }) }) }, header.label);
    })
  ] });
};
const activeStyle = (theme) => css`
  color: ${theme.colors.primary600};
  font-weight: ${theme.fontWeights.bold};

  ${CarretIcon} {
    path {
      fill: ${theme.colors.primary600};
    }
  }
`;

const ConditionsButtonImpl = React.forwardRef(
  ({ onClick, className, hasConditions = false, variant = "tertiary" }, ref) => {
    const { formatMessage } = useIntl();
    return /* @__PURE__ */ jsx(ButtonContainer, { $hasConditions: hasConditions, className, children: /* @__PURE__ */ jsx(Button, { variant, startIcon: /* @__PURE__ */ jsx(Cog, {}), onClick, ref, type: "button", children: formatMessage({
      id: "global.settings",
      defaultMessage: "Settings"
    }) }) });
  }
);
const ButtonContainer = styled(Box)`
  ${({ $hasConditions, theme }) => $hasConditions && `
    &:before {
      content: '';
      position: absolute;
      top: -3px;
      left: -10px;
      width: 6px;
      height: 6px;
      border-radius: 2rem;
      background: ${theme.colors.primary600};
    }
  `}
`;
const ConditionsButton = styled(ConditionsButtonImpl)``;

const ConditionsModal = ({
  actions = [],
  headerBreadCrumbs = [],
  isFormDisabled,
  onClose
}) => {
  const { formatMessage } = useIntl();
  const { availableConditions, modifiedData, onChangeConditions } = usePermissionsDataManager();
  const arrayOfOptionsGroupedByCategory = React.useMemo(() => {
    return Object.entries(groupBy(availableConditions, "category"));
  }, [availableConditions]);
  const actionsToDisplay = actions.filter(
    // @ts-expect-error – TODO: fix this type issue
    ({ isDisplayed, hasSomeActionsSelected, hasAllActionsSelected }) => isDisplayed && Boolean(hasSomeActionsSelected || hasAllActionsSelected)
  );
  const [state, setState] = React.useState(
    createDefaultConditionsForm(actionsToDisplay, modifiedData, arrayOfOptionsGroupedByCategory)
  );
  const handleChange = (name, values) => {
    setState(
      produce((draft) => {
        if (!draft[name]) {
          draft[name] = {};
        }
        if (!draft[name].default) {
          draft[name].default = {};
        }
        draft[name].default = values;
      })
    );
  };
  const handleSubmit = () => {
    const conditionsWithoutCategory = Object.entries(state).reduce(
      (acc, current) => {
        const [key, value] = current;
        const merged = Object.values(value).reduce((acc1, current1) => {
          return { ...acc1, ...current1 };
        }, {});
        acc[key] = merged;
        return acc;
      },
      {}
    );
    onChangeConditions(conditionsWithoutCategory);
    onClose && onClose();
  };
  const onCloseModal = () => {
    setState(
      createDefaultConditionsForm(actionsToDisplay, modifiedData, arrayOfOptionsGroupedByCategory)
    );
    onClose && onClose();
  };
  return /* @__PURE__ */ jsxs(Modal.Content, { children: [
    /* @__PURE__ */ jsx(Modal.Header, { children: /* @__PURE__ */ jsx(Breadcrumbs, { id: "condition-modal-breadcrumbs", label: headerBreadCrumbs.join(", "), children: headerBreadCrumbs.map((label, index, arr) => /* @__PURE__ */ jsx(Crumb, { isCurrent: index === arr.length - 1, children: upperFirst(
      formatMessage({
        id: label,
        defaultMessage: label
      })
    ) }, label)) }) }),
    /* @__PURE__ */ jsxs(Modal.Body, { children: [
      actionsToDisplay.length === 0 && /* @__PURE__ */ jsx(Typography, { children: formatMessage({
        id: "Settings.permissions.conditions.no-actions",
        defaultMessage: "You first need to select actions (create, read, update, ...) before defining conditions on them."
      }) }),
      /* @__PURE__ */ jsx("ul", { children: actionsToDisplay.map(({ actionId, label, pathToConditionsObject }, index) => {
        const name = pathToConditionsObject.join("..");
        return /* @__PURE__ */ jsx(
          ActionRow,
          {
            arrayOfOptionsGroupedByCategory,
            label,
            isFormDisabled,
            isGrey: index % 2 === 0,
            name,
            onChange: handleChange,
            value: get(state, name, {})
          },
          actionId
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxs(Modal.Footer, { children: [
      /* @__PURE__ */ jsx(Button, { variant: "tertiary", onClick: () => onCloseModal(), children: formatMessage({ id: "app.components.Button.cancel", defaultMessage: "Cancel" }) }),
      /* @__PURE__ */ jsx(Button, { onClick: handleSubmit, children: formatMessage({
        id: "Settings.permissions.conditions.apply",
        defaultMessage: "Apply"
      }) })
    ] })
  ] });
};
const createDefaultConditionsForm = (actionsToDisplay, modifiedData, arrayOfOptionsGroupedByCategory) => {
  return actionsToDisplay.reduce((acc, current) => {
    const valueFromModifiedData = get(
      modifiedData,
      [...current.pathToConditionsObject, "conditions"],
      {}
    );
    const categoryDefaultForm = arrayOfOptionsGroupedByCategory.reduce((acc2, current2) => {
      const [categoryName, relatedConditions] = current2;
      const conditionsForm = relatedConditions.reduce((acc3, current3) => {
        acc3[current3.id] = get(valueFromModifiedData, current3.id, false);
        return acc3;
      }, {});
      acc2[categoryName] = conditionsForm;
      return acc2;
    }, {});
    acc[current.pathToConditionsObject.join("..")] = categoryDefaultForm;
    return acc;
  }, {});
};
const ActionRow = ({
  arrayOfOptionsGroupedByCategory,
  isFormDisabled = false,
  isGrey = false,
  label,
  name,
  onChange,
  value
}) => {
  const { formatMessage } = useIntl();
  const handleChange = (val) => {
    if (onChange) {
      onChange(name, getNewStateFromChangedValues(arrayOfOptionsGroupedByCategory, val));
    }
  };
  return /* @__PURE__ */ jsxs(
    Flex,
    {
      tag: "li",
      background: isGrey ? "neutral100" : "neutral0",
      paddingBottom: 3,
      paddingTop: 3,
      justifyContent: "space-evenly",
      children: [
        /* @__PURE__ */ jsxs(Flex, { style: { width: 180 }, children: [
          /* @__PURE__ */ jsxs(Typography, { variant: "sigma", textColor: "neutral600", children: [
            formatMessage({
              id: "Settings.permissions.conditions.can",
              defaultMessage: "Can"
            }),
            " "
          ] }),
          /* @__PURE__ */ jsx(Typography, { variant: "sigma", title: label, textColor: "primary600", ellipsis: true, children: formatMessage({
            id: `Settings.roles.form.permissions.${label.toLowerCase()}`,
            defaultMessage: label
          }) }),
          /* @__PURE__ */ jsxs(Typography, { variant: "sigma", textColor: "neutral600", children: [
            " ",
            formatMessage({
              id: "Settings.permissions.conditions.when",
              defaultMessage: "When"
            })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Box, { style: { maxWidth: 430, width: "100%" }, children: /* @__PURE__ */ jsx(
          MultiSelectNested,
          {
            id: name,
            customizeContent: (values = []) => `${values.length} currently selected`,
            onChange: handleChange,
            value: getSelectedValues(value),
            options: getNestedOptions(arrayOfOptionsGroupedByCategory),
            disabled: isFormDisabled
          }
        ) })
      ]
    }
  );
};
const getSelectedValues = (rawValue) => Object.values(rawValue).map(
  (x) => Object.entries(x).filter(([, value]) => value).map(([key]) => key)
).flat();
const getNestedOptions = (options) => options.reduce((acc, [label, children]) => {
  acc.push({
    label: capitalise(label),
    children: children.map((child) => ({
      label: child.displayName,
      value: child.id
    }))
  });
  return acc;
}, []);
const getNewStateFromChangedValues = (options, changedValues) => options.map(([, values]) => values).flat().reduce(
  (acc, curr) => ({ [curr.id]: changedValues.includes(curr.id), ...acc }),
  {}
);

const ContentTypeCollapses = ({
  actions = [],
  isFormDisabled,
  pathToData,
  subjects = []
}) => {
  const [collapseToOpen, setCollapseToOpen] = React.useState(null);
  const handleClickToggleCollapse = (collapseName) => () => {
    const nextCollapseToOpen = collapseToOpen === collapseName ? null : collapseName;
    setCollapseToOpen(nextCollapseToOpen);
  };
  return /* @__PURE__ */ jsx(Fragment, { children: subjects.map(({ uid, label, properties }, index) => {
    const isActive = collapseToOpen === uid;
    const availableActions = actions.map((action) => ({
      ...action,
      isDisplayed: Array.isArray(action.subjects) && action.subjects.indexOf(uid) !== -1
    }));
    return /* @__PURE__ */ jsxs(
      Flex,
      {
        direction: "column",
        display: "inline-flex",
        alignItems: "stretch",
        minWidth: "100%",
        borderColor: isActive ? "primary600" : void 0,
        children: [
          /* @__PURE__ */ jsx(
            Collapse,
            {
              availableActions,
              isActive,
              isGrey: index % 2 === 0,
              isFormDisabled,
              label,
              onClickToggle: handleClickToggleCollapse(uid),
              pathToData: [pathToData, uid].join("..")
            }
          ),
          isActive && properties.map(({ label: propertyLabel, value, children: childrenForm }) => {
            return /* @__PURE__ */ jsx(
              CollapsePropertyMatrix,
              {
                availableActions,
                childrenForm,
                isFormDisabled,
                label: propertyLabel,
                pathToData: [pathToData, uid].join(".."),
                propertyName: value
              },
              value
            );
          })
        ]
      },
      uid
    );
  }) });
};
const Collapse = ({
  availableActions = [],
  isActive = false,
  isGrey = false,
  isFormDisabled = false,
  label,
  onClickToggle,
  pathToData
}) => {
  const { formatMessage } = useIntl();
  const { modifiedData, onChangeParentCheckbox, onChangeSimpleCheckbox } = usePermissionsDataManager();
  const [isConditionModalOpen, setIsConditionModalOpen] = React.useState(false);
  const mainData = get(modifiedData, pathToData.split(".."), {});
  const dataWithoutCondition = React.useMemo(() => {
    return Object.keys(mainData).reduce((acc, current) => {
      acc[current] = omit(mainData[current], "conditions");
      return acc;
    }, {});
  }, [mainData]);
  const { hasAllActionsSelected, hasSomeActionsSelected } = getCheckboxState(dataWithoutCondition);
  const checkboxesActions = React.useMemo(() => {
    return generateCheckboxesActions(availableActions, modifiedData, pathToData);
  }, [availableActions, modifiedData, pathToData]);
  const doesConditionButtonHasConditions = checkboxesActions.some((action) => action.hasConditions);
  return /* @__PURE__ */ jsxs(BoxWrapper, { $isActive: isActive, children: [
    /* @__PURE__ */ jsxs(
      Wrapper,
      {
        height: rowHeight,
        flex: 1,
        alignItems: "center",
        background: isGrey ? "neutral100" : "neutral0",
        children: [
          /* @__PURE__ */ jsx(
            RowLabelWithCheckbox,
            {
              isCollapsable: true,
              isFormDisabled,
              label: capitalise(label),
              checkboxName: pathToData,
              onChange: onChangeParentCheckbox,
              onClick: onClickToggle,
              someChecked: hasSomeActionsSelected,
              value: hasAllActionsSelected,
              isActive,
              children: /* @__PURE__ */ jsx(Chevron, { paddingLeft: 2, children: isActive ? /* @__PURE__ */ jsx(ChevronUp, {}) : /* @__PURE__ */ jsx(ChevronDown, {}) })
            }
          ),
          /* @__PURE__ */ jsx(Flex, { style: { flex: 1 }, children: checkboxesActions.map(
            ({ actionId, hasSomeActionsSelected: hasSomeActionsSelected2, isDisplayed, ...restAction }) => {
              if (!isDisplayed) {
                return /* @__PURE__ */ jsx(HiddenAction, {}, actionId);
              }
              const {
                hasConditions,
                hasAllActionsSelected: hasAllActionsSelected2,
                isParentCheckbox,
                checkboxName,
                label: permissionLabel
              } = restAction;
              if (isParentCheckbox) {
                return /* @__PURE__ */ jsxs(Cell, { justifyContent: "center", alignItems: "center", children: [
                  hasConditions && /* @__PURE__ */ jsx(
                    Box,
                    {
                      tag: "span",
                      position: "absolute",
                      top: "-6px",
                      left: "37px",
                      width: "6px",
                      height: "6px",
                      borderRadius: "20px",
                      background: "primary600"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Checkbox,
                    {
                      disabled: isFormDisabled,
                      name: checkboxName,
                      "aria-label": formatMessage(
                        {
                          id: `Settings.permissions.select-by-permission`,
                          defaultMessage: "Select {label} permission"
                        },
                        { label: `${permissionLabel} ${label}` }
                      ),
                      onCheckedChange: (value) => {
                        onChangeParentCheckbox({
                          target: {
                            name: checkboxName,
                            value: !!value
                          }
                        });
                      },
                      checked: hasSomeActionsSelected2 ? "indeterminate" : hasAllActionsSelected2
                    }
                  )
                ] }, actionId);
              }
              return /* @__PURE__ */ jsxs(Cell, { justifyContent: "center", alignItems: "center", children: [
                hasConditions && /* @__PURE__ */ jsx(
                  Box,
                  {
                    tag: "span",
                    position: "absolute",
                    top: "-6px",
                    left: "37px",
                    width: "6px",
                    height: "6px",
                    borderRadius: "20px",
                    background: "primary600"
                  }
                ),
                /* @__PURE__ */ jsx(
                  Checkbox,
                  {
                    disabled: isFormDisabled,
                    name: checkboxName,
                    onCheckedChange: (value) => {
                      onChangeSimpleCheckbox({
                        target: {
                          name: checkboxName,
                          value: !!value
                        }
                      });
                    },
                    checked: hasConditions ? "indeterminate" : hasAllActionsSelected2
                  }
                )
              ] }, actionId);
            }
          ) })
        ]
      }
    ),
    /* @__PURE__ */ jsx(Box, { bottom: "10px", right: "9px", position: "absolute", children: /* @__PURE__ */ jsxs(
      Modal.Root,
      {
        open: isConditionModalOpen,
        onOpenChange: () => {
          setIsConditionModalOpen((prev) => !prev);
        },
        children: [
          /* @__PURE__ */ jsx(Modal.Trigger, { children: /* @__PURE__ */ jsx(ConditionsButton, { hasConditions: doesConditionButtonHasConditions }) }),
          /* @__PURE__ */ jsx(
            ConditionsModal,
            {
              headerBreadCrumbs: [label, "Settings.permissions.conditions.conditions"],
              actions: checkboxesActions,
              isFormDisabled,
              onClose: () => {
                setIsConditionModalOpen(false);
              }
            }
          )
        ]
      }
    ) })
  ] });
};
const generateCheckboxesActions = (availableActions, modifiedData, pathToData) => {
  return availableActions.map(({ actionId, isDisplayed, applyToProperties, label }) => {
    if (!isDisplayed) {
      return { actionId, hasSomeActionsSelected: false, isDisplayed };
    }
    const baseCheckboxNameArray = [...pathToData.split(".."), actionId];
    const checkboxNameArray = isEmpty(applyToProperties) ? [...baseCheckboxNameArray, "properties", "enabled"] : baseCheckboxNameArray;
    const conditionsValue = get(modifiedData, [...baseCheckboxNameArray, "conditions"], null);
    const baseCheckboxAction = {
      actionId,
      checkboxName: checkboxNameArray.join(".."),
      hasConditions: createArrayOfValues(conditionsValue).some((val) => val),
      isDisplayed,
      label,
      pathToConditionsObject: baseCheckboxNameArray
    };
    if (isEmpty(applyToProperties)) {
      const value = get(modifiedData, checkboxNameArray, false);
      return {
        ...baseCheckboxAction,
        hasAllActionsSelected: value,
        hasSomeActionsSelected: value,
        isParentCheckbox: false
      };
    }
    const mainData = get(modifiedData, checkboxNameArray, null);
    const { hasAllActionsSelected, hasSomeActionsSelected } = getCheckboxState(mainData);
    return {
      ...baseCheckboxAction,
      hasAllActionsSelected,
      hasSomeActionsSelected,
      isParentCheckbox: true
    };
  });
};
const activeRowStyle = (theme, isActive) => `
  ${Wrapper} {
    background-color: ${theme.colors.primary100};
    color: ${theme.colors.primary600};
    border-radius: ${isActive ? "2px 2px 0 0" : "2px"};
    font-weight: ${theme.fontWeights.bold};
  }

  ${Chevron} {
    display: flex;
  }
  ${ConditionsButton} {
    display: block;
  }

  &:focus-within {
    ${() => activeRowStyle(theme, isActive)}
  }
`;
const Wrapper = styled(Flex)`
  border: 1px solid transparent;
`;
const BoxWrapper = styled.div`
  display: inline-flex;
  min-width: 100%;
  position: relative;

  ${ConditionsButton} {
    display: none;
  }

  ${({ $isActive, theme }) => $isActive && activeRowStyle(theme, $isActive)}

  &:hover {
    ${({ theme, $isActive }) => activeRowStyle(theme, $isActive)}
  }
`;
const Cell = styled(Flex)`
  width: ${cellWidth};
  position: relative;
`;
const Chevron = styled(Box)`
  display: none;

  svg {
    width: 1.4rem;
  }

  path {
    fill: ${({ theme }) => theme.colors.primary600};
  }
`;

const GlobalActions = ({ actions = [], isFormDisabled, kind }) => {
  const { formatMessage } = useIntl();
  const { modifiedData, onChangeCollectionTypeGlobalActionCheckbox } = usePermissionsDataManager();
  const displayedActions = actions.filter(({ subjects }) => subjects && subjects.length);
  const checkboxesState = React.useMemo(() => {
    const actionsIds = displayedActions.map(({ actionId }) => actionId);
    const data = modifiedData[kind];
    const relatedActionsData = actionsIds.reduce(
      (acc, actionId) => {
        Object.keys(data).forEach((ctUid) => {
          const actionIdData = get(data, [ctUid, actionId]);
          const actionIdState = { [ctUid]: removeConditionKeyFromData(actionIdData) };
          if (!acc[actionId]) {
            acc[actionId] = actionIdState;
          } else {
            acc[actionId] = { ...acc[actionId], ...actionIdState };
          }
        });
        return acc;
      },
      {}
    );
    const checkboxesState2 = Object.keys(relatedActionsData).reduce((acc, current) => {
      acc[current] = getCheckboxState(relatedActionsData[current]);
      return acc;
    }, {});
    return checkboxesState2;
  }, [modifiedData, displayedActions, kind]);
  return /* @__PURE__ */ jsx(Box, { paddingBottom: 4, paddingTop: 6, style: { paddingLeft: firstRowWidth }, children: /* @__PURE__ */ jsx(Flex, { gap: 0, children: displayedActions.map(({ label, actionId }) => {
    return /* @__PURE__ */ jsxs(
      Flex,
      {
        shrink: 0,
        width: cellWidth,
        direction: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        children: [
          /* @__PURE__ */ jsx(Typography, { variant: "sigma", textColor: "neutral500", children: formatMessage({
            id: `Settings.roles.form.permissions.${label.toLowerCase()}`,
            defaultMessage: label
          }) }),
          /* @__PURE__ */ jsx(
            Checkbox,
            {
              disabled: isFormDisabled,
              onCheckedChange: (value) => {
                onChangeCollectionTypeGlobalActionCheckbox(kind, actionId, !!value);
              },
              name: actionId,
              "aria-label": formatMessage(
                {
                  id: `Settings.permissions.select-all-by-permission`,
                  defaultMessage: "Select all {label} permissions"
                },
                {
                  label: formatMessage({
                    id: `Settings.roles.form.permissions.${label.toLowerCase()}`,
                    defaultMessage: label
                  })
                }
              ),
              checked: get(checkboxesState, [actionId, "hasSomeActionsSelected"], false) ? "indeterminate" : get(checkboxesState, [actionId, "hasAllActionsSelected"], false)
            }
          )
        ]
      },
      actionId
    );
  }) }) });
};

const ContentTypes = ({
  isFormDisabled,
  kind,
  layout: { actions, subjects }
}) => {
  const sortedSubjects = [...subjects].sort((a, b) => a.label.localeCompare(b.label));
  return /* @__PURE__ */ jsxs(Box, { background: "neutral0", children: [
    /* @__PURE__ */ jsx(GlobalActions, { actions, kind, isFormDisabled }),
    /* @__PURE__ */ jsx(
      ContentTypeCollapses,
      {
        actions,
        isFormDisabled,
        pathToData: kind,
        subjects: sortedSubjects
      }
    )
  ] });
};

const PluginsAndSettingsPermissions = ({
  layout,
  ...restProps
}) => {
  return /* @__PURE__ */ jsx(Box, { padding: 6, background: "neutral0", children: /* @__PURE__ */ jsx(Accordion.Root, { size: "M", children: layout.map(({ category, categoryId, childrenForm }, index) => {
    return /* @__PURE__ */ jsx(
      Row,
      {
        childrenForm,
        variant: index % 2 === 1 ? "primary" : "secondary",
        name: category,
        pathToData: [restProps.kind, categoryId],
        ...restProps
      },
      category
    );
  }) }) });
};
const Row = ({
  childrenForm,
  kind,
  name,
  isFormDisabled = false,
  variant,
  pathToData
}) => {
  const { formatMessage } = useIntl();
  const categoryName = name.split("::").pop() ?? "";
  return /* @__PURE__ */ jsxs(Accordion.Item, { value: name, children: [
    /* @__PURE__ */ jsx(Accordion.Header, { variant, children: /* @__PURE__ */ jsx(
      Accordion.Trigger,
      {
        caretPosition: "right",
        description: `${formatMessage(
          { id: "Settings.permissions.category", defaultMessage: categoryName },
          { category: categoryName }
        )} ${kind === "plugins" ? "plugin" : kind}`,
        children: capitalise(categoryName)
      }
    ) }),
    /* @__PURE__ */ jsx(Accordion.Content, { children: /* @__PURE__ */ jsx(Box, { padding: 6, children: childrenForm.map(({ actions, subCategoryName, subCategoryId }) => /* @__PURE__ */ jsx(
      SubCategory,
      {
        actions,
        categoryName,
        isFormDisabled,
        subCategoryName,
        pathToData: [...pathToData, subCategoryId]
      },
      subCategoryName
    )) }) })
  ] });
};
const SubCategory = ({
  actions = [],
  categoryName,
  isFormDisabled,
  subCategoryName,
  pathToData
}) => {
  const { modifiedData, onChangeParentCheckbox, onChangeSimpleCheckbox } = usePermissionsDataManager();
  const [isConditionModalOpen, setIsConditionModalOpen] = React.useState(false);
  const { formatMessage } = useIntl();
  const mainData = get(modifiedData, pathToData, {});
  const dataWithoutCondition = React.useMemo(() => {
    return Object.keys(mainData).reduce((acc, current) => {
      acc[current] = removeConditionKeyFromData(mainData[current]);
      return acc;
    }, {});
  }, [mainData]);
  const { hasAllActionsSelected, hasSomeActionsSelected } = getCheckboxState(dataWithoutCondition);
  const formattedActions = React.useMemo(() => {
    return actions.map((action) => {
      const checkboxName = [...pathToData, action.action, "properties", "enabled"];
      const checkboxValue = get(modifiedData, checkboxName, false);
      const conditionValue = get(modifiedData, [...pathToData, action.action, "conditions"], {});
      const hasConditions = createArrayOfValues(conditionValue).some((val) => val);
      return {
        ...action,
        isDisplayed: checkboxValue,
        checkboxName: checkboxName.join(".."),
        hasSomeActionsSelected: checkboxValue,
        value: checkboxValue,
        hasConditions,
        label: action.displayName,
        actionId: action.action,
        pathToConditionsObject: [...pathToData, action.action]
      };
    });
  }, [actions, modifiedData, pathToData]);
  const datum = get(modifiedData, [...pathToData], {});
  const doesButtonHasCondition = createArrayOfValues(
    Object.entries(datum).reduce((acc, current) => {
      const [catName, { conditions }] = current;
      acc[catName] = conditions;
      return acc;
    }, {})
  ).some((val) => val);
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(Box, { children: [
    /* @__PURE__ */ jsxs(Flex, { justifyContent: "space-between", alignItems: "center", children: [
      /* @__PURE__ */ jsx(Box, { paddingRight: 4, children: /* @__PURE__ */ jsx(Typography, { variant: "sigma", textColor: "neutral600", children: subCategoryName }) }),
      /* @__PURE__ */ jsx(Border, { flex: 1 }),
      /* @__PURE__ */ jsx(Box, { paddingLeft: 4, children: /* @__PURE__ */ jsx(
        Checkbox,
        {
          name: pathToData.join(".."),
          disabled: isFormDisabled,
          onCheckedChange: (value) => {
            onChangeParentCheckbox({
              target: {
                name: pathToData.join(".."),
                value: !!value
              }
            });
          },
          checked: hasSomeActionsSelected ? "indeterminate" : hasAllActionsSelected,
          children: formatMessage({ id: "app.utils.select-all", defaultMessage: "Select all" })
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs(Flex, { paddingTop: 6, paddingBottom: 6, children: [
      /* @__PURE__ */ jsx(Grid.Root, { gap: 2, style: { flex: 1 }, children: formattedActions.map(({ checkboxName, value, action, displayName, hasConditions }) => {
        return /* @__PURE__ */ jsx(Grid.Item, { col: 3, direction: "column", alignItems: "start", children: /* @__PURE__ */ jsx(CheckboxWrapper, { $disabled: isFormDisabled, $hasConditions: hasConditions, children: /* @__PURE__ */ jsx(
          Checkbox,
          {
            name: checkboxName,
            disabled: isFormDisabled,
            onCheckedChange: (value2) => {
              onChangeSimpleCheckbox({
                target: {
                  name: checkboxName,
                  value: !!value2
                }
              });
            },
            checked: value,
            children: displayName
          }
        ) }) }, action);
      }) }),
      /* @__PURE__ */ jsxs(
        Modal.Root,
        {
          open: isConditionModalOpen,
          onOpenChange: () => {
            setIsConditionModalOpen((prev) => !prev);
          },
          children: [
            /* @__PURE__ */ jsx(Modal.Trigger, { children: /* @__PURE__ */ jsx(ConditionsButton, { hasConditions: doesButtonHasCondition }) }),
            /* @__PURE__ */ jsx(
              ConditionsModal,
              {
                headerBreadCrumbs: [categoryName, subCategoryName],
                actions: formattedActions,
                isFormDisabled,
                onClose: () => {
                  setIsConditionModalOpen(false);
                }
              }
            )
          ]
        }
      )
    ] })
  ] }) });
};
const Border = styled(Box)`
  align-self: center;
  border-top: 1px solid ${({ theme }) => theme.colors.neutral150};
`;
const CheckboxWrapper = styled.div`
  position: relative;
  word-break: keep-all;
  ${({ $hasConditions, $disabled, theme }) => $hasConditions && `
    &:before {
      content: '';
      position: absolute;
      top: -0.4rem;
      left: -0.8rem;
      width: 0.6rem;
      height: 0.6rem;
      border-radius: 2rem;
      background: ${$disabled ? theme.colors.neutral100 : theme.colors.primary600};
    }
  `}
`;

const TAB_LABELS = [
  {
    labelId: "app.components.LeftMenuLinkContainer.collectionTypes",
    defaultMessage: "Collection Types",
    id: "collectionTypes"
  },
  {
    labelId: "app.components.LeftMenuLinkContainer.singleTypes",
    id: "singleTypes",
    defaultMessage: "Single Types"
  },
  {
    labelId: "app.components.LeftMenuLinkContainer.plugins",
    defaultMessage: "Plugins",
    id: "plugins"
  },
  {
    labelId: "app.components.LeftMenuLinkContainer.settings",
    defaultMessage: "Settings",
    id: "settings"
  }
];
const Permissions = React.forwardRef(
  ({ layout, isFormDisabled, permissions = [] }, api) => {
    const [{ initialData, layouts, modifiedData }, dispatch] = React.useReducer(
      reducer,
      initialState,
      () => init(layout, permissions)
    );
    const { formatMessage } = useIntl();
    React.useImperativeHandle(api, () => {
      return {
        getPermissions() {
          const collectionTypesDiff = difference(
            initialData.collectionTypes,
            modifiedData.collectionTypes
          );
          const singleTypesDiff = difference(initialData.singleTypes, modifiedData.singleTypes);
          const contentTypesDiff = { ...collectionTypesDiff, ...singleTypesDiff };
          let didUpdateConditions;
          if (isEmpty(contentTypesDiff)) {
            didUpdateConditions = false;
          } else {
            didUpdateConditions = Object.values(contentTypesDiff).some((permission = {}) => {
              return Object.values(permission).some(
                (permissionValue) => has(permissionValue, "conditions")
              );
            });
          }
          return { permissionsToSend: formatPermissionsForAPI(modifiedData), didUpdateConditions };
        },
        resetForm() {
          dispatch({ type: "RESET_FORM" });
        },
        setFormAfterSubmit() {
          dispatch({ type: "SET_FORM_AFTER_SUBMIT" });
        }
      };
    });
    const handleChangeCollectionTypeLeftActionRowCheckbox = (pathToCollectionType, propertyName, rowName, value) => {
      dispatch({
        type: "ON_CHANGE_COLLECTION_TYPE_ROW_LEFT_CHECKBOX",
        pathToCollectionType,
        propertyName,
        rowName,
        value
      });
    };
    const handleChangeCollectionTypeGlobalActionCheckbox = (collectionTypeKind, actionId, value) => {
      dispatch({
        type: "ON_CHANGE_COLLECTION_TYPE_GLOBAL_ACTION_CHECKBOX",
        collectionTypeKind,
        actionId,
        value
      });
    };
    const handleChangeConditions = (conditions) => {
      dispatch({ type: "ON_CHANGE_CONDITIONS", conditions });
    };
    const handleChangeSimpleCheckbox = React.useCallback(({ target: { name, value } }) => {
      dispatch({
        type: "ON_CHANGE_SIMPLE_CHECKBOX",
        keys: name,
        value
      });
    }, []);
    const handleChangeParentCheckbox = React.useCallback(({ target: { name, value } }) => {
      dispatch({
        type: "ON_CHANGE_TOGGLE_PARENT_CHECKBOX",
        keys: name,
        value
      });
    }, []);
    return /* @__PURE__ */ jsx(
      PermissionsDataManagerProvider,
      {
        availableConditions: layout.conditions,
        modifiedData,
        onChangeConditions: handleChangeConditions,
        onChangeSimpleCheckbox: handleChangeSimpleCheckbox,
        onChangeParentCheckbox: handleChangeParentCheckbox,
        onChangeCollectionTypeLeftActionRowCheckbox: handleChangeCollectionTypeLeftActionRowCheckbox,
        onChangeCollectionTypeGlobalActionCheckbox: handleChangeCollectionTypeGlobalActionCheckbox,
        children: /* @__PURE__ */ jsxs(Tabs.Root, { defaultValue: TAB_LABELS[0].id, children: [
          /* @__PURE__ */ jsx(
            Tabs.List,
            {
              "aria-label": formatMessage({
                id: "Settings.permissions.users.tabs.label",
                defaultMessage: "Tabs Permissions"
              }),
              children: TAB_LABELS.map((tabLabel) => /* @__PURE__ */ jsx(Tabs.Trigger, { value: tabLabel.id, children: formatMessage({ id: tabLabel.labelId, defaultMessage: tabLabel.defaultMessage }) }, tabLabel.id))
            }
          ),
          /* @__PURE__ */ jsx(Tabs.Content, { value: TAB_LABELS[0].id, children: /* @__PURE__ */ jsx(
            ContentTypes,
            {
              layout: layouts.collectionTypes,
              kind: "collectionTypes",
              isFormDisabled
            }
          ) }),
          /* @__PURE__ */ jsx(Tabs.Content, { value: TAB_LABELS[1].id, children: /* @__PURE__ */ jsx(
            ContentTypes,
            {
              layout: layouts.singleTypes,
              kind: "singleTypes",
              isFormDisabled
            }
          ) }),
          /* @__PURE__ */ jsx(Tabs.Content, { value: TAB_LABELS[2].id, children: /* @__PURE__ */ jsx(
            PluginsAndSettingsPermissions,
            {
              layout: layouts.plugins,
              kind: "plugins",
              isFormDisabled
            }
          ) }),
          /* @__PURE__ */ jsx(Tabs.Content, { value: TAB_LABELS[3].id, children: /* @__PURE__ */ jsx(
            PluginsAndSettingsPermissions,
            {
              layout: layouts.settings,
              kind: "settings",
              isFormDisabled
            }
          ) })
        ] })
      }
    );
  }
);
const initialState = {
  initialData: {},
  modifiedData: {},
  layouts: {}
};
const reducer = (state, action) => produce(state, (draftState) => {
  switch (action.type) {
    case "ON_CHANGE_COLLECTION_TYPE_GLOBAL_ACTION_CHECKBOX": {
      const { collectionTypeKind, actionId, value } = action;
      const pathToData = ["modifiedData", collectionTypeKind];
      Object.keys(get(state, pathToData)).forEach((collectionType) => {
        const collectionTypeActionData = get(
          state,
          [...pathToData, collectionType, actionId],
          void 0
        );
        if (collectionTypeActionData) {
          let updatedValues = updateValues(collectionTypeActionData, value);
          if (!value && updatedValues.conditions) {
            const updatedConditions = updateValues(updatedValues.conditions, false);
            updatedValues = { ...updatedValues, conditions: updatedConditions };
          }
          set(draftState, [...pathToData, collectionType, actionId], updatedValues);
        }
      });
      break;
    }
    case "ON_CHANGE_COLLECTION_TYPE_ROW_LEFT_CHECKBOX": {
      const { pathToCollectionType, propertyName, rowName, value } = action;
      let nextModifiedDataState = cloneDeep(state.modifiedData);
      const pathToModifiedDataCollectionType = pathToCollectionType.split("..");
      const objToUpdate = get(nextModifiedDataState, pathToModifiedDataCollectionType, {});
      Object.keys(objToUpdate).forEach((actionId) => {
        if (has(objToUpdate[actionId], `properties.${propertyName}`)) {
          const objValue = get(objToUpdate, [actionId, "properties", propertyName, rowName]);
          const pathToDataToSet = [
            ...pathToModifiedDataCollectionType,
            actionId,
            "properties",
            propertyName,
            rowName
          ];
          if (!isObject$1(objValue)) {
            set(nextModifiedDataState, pathToDataToSet, value);
          } else {
            const updatedValue = updateValues(objValue, value);
            set(nextModifiedDataState, pathToDataToSet, updatedValue);
          }
        }
      });
      if (!value) {
        nextModifiedDataState = updateConditionsToFalse(nextModifiedDataState);
      }
      set(draftState, "modifiedData", nextModifiedDataState);
      break;
    }
    case "ON_CHANGE_CONDITIONS": {
      Object.entries(action.conditions).forEach((array) => {
        const [stringPathToData, conditionsToUpdate] = array;
        set(
          draftState,
          ["modifiedData", ...stringPathToData.split(".."), "conditions"],
          conditionsToUpdate
        );
      });
      break;
    }
    case "ON_CHANGE_SIMPLE_CHECKBOX": {
      let nextModifiedDataState = cloneDeep(state.modifiedData);
      set(nextModifiedDataState, [...action.keys.split("..")], action.value);
      if (!action.value) {
        nextModifiedDataState = updateConditionsToFalse(nextModifiedDataState);
      }
      set(draftState, "modifiedData", nextModifiedDataState);
      break;
    }
    case "ON_CHANGE_TOGGLE_PARENT_CHECKBOX": {
      const { keys, value } = action;
      const pathToValue = [...keys.split("..")];
      let nextModifiedDataState = cloneDeep(state.modifiedData);
      const oldValues = get(nextModifiedDataState, pathToValue, {});
      const updatedValues = updateValues(oldValues, value);
      set(nextModifiedDataState, pathToValue, updatedValues);
      if (!value) {
        nextModifiedDataState = updateConditionsToFalse(nextModifiedDataState);
      }
      set(draftState, ["modifiedData"], nextModifiedDataState);
      break;
    }
    case "RESET_FORM": {
      draftState.modifiedData = state.initialData;
      break;
    }
    case "SET_FORM_AFTER_SUBMIT": {
      draftState.initialData = state.modifiedData;
      break;
    }
    default:
      return draftState;
  }
});
const init = (layout, permissions) => {
  const {
    conditions,
    sections: { collectionTypes, singleTypes, plugins, settings }
  } = layout;
  const layouts = {
    collectionTypes,
    singleTypes,
    plugins: formatLayout(plugins, "plugin"),
    settings: formatLayout(settings, "category")
  };
  const defaultForm = {
    collectionTypes: createDefaultCTForm(collectionTypes, conditions, permissions),
    singleTypes: createDefaultCTForm(singleTypes, conditions, permissions),
    plugins: createDefaultForm(layouts.plugins, conditions, permissions),
    settings: createDefaultForm(layouts.settings, conditions, permissions)
  };
  return {
    initialData: defaultForm,
    modifiedData: defaultForm,
    layouts
  };
};

export { Permissions as P };
//# sourceMappingURL=Permissions-DQUqSN3m.mjs.map
