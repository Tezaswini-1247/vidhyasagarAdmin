import { jsx, jsxs } from 'react/jsx-runtime';
import { LinkButton, useCollator, Typography, Flex, Dialog, Box, IconButton } from '@strapi/design-system';
import { Trash, Pencil } from '@strapi/icons';
import { useIntl } from 'react-intl';
import { useNavigate, NavLink } from 'react-router-dom';
import { styled } from 'styled-components';
import { T as Table$1, C as ConfirmDialog } from './index-DdAmwxFa.mjs';
import * as React from 'react';
import { intervalToDuration, isPast } from 'date-fns';
import { o as useQueryParams, c as useTracking } from './Theme-DQRUlj-X.mjs';

const intervals = ["years", "months", "days", "hours", "minutes", "seconds"];
const RelativeTime = React.forwardRef(
  ({ timestamp, customIntervals = [], ...restProps }, forwardedRef) => {
    const { formatRelativeTime, formatDate, formatTime } = useIntl();
    const interval = intervalToDuration({
      start: timestamp,
      end: Date.now()
      // see https://github.com/date-fns/date-fns/issues/2891 – No idea why it's all partial it returns it every time.
    });
    const unit = intervals.find((intervalUnit) => {
      return interval[intervalUnit] > 0 && Object.keys(interval).includes(intervalUnit);
    });
    const relativeTime = isPast(timestamp) ? -interval[unit] : interval[unit];
    const customInterval = customIntervals.find(
      (custom) => interval[custom.unit] < custom.threshold
    );
    const displayText = customInterval ? customInterval.text : formatRelativeTime(relativeTime, unit, { numeric: "auto" });
    return /* @__PURE__ */ jsx(
      "time",
      {
        ref: forwardedRef,
        dateTime: timestamp.toISOString(),
        role: "time",
        title: `${formatDate(timestamp)} ${formatTime(timestamp)}`,
        ...restProps,
        children: displayText
      }
    );
  }
);

const Table = ({
  permissions,
  headers = [],
  isLoading = false,
  tokens = [],
  onConfirmDelete,
  tokenType
}) => {
  const [{ query }] = useQueryParams();
  const { formatMessage, locale } = useIntl();
  const [, sortOrder] = query && query.sort ? query.sort.split(":") : [void 0, "ASC"];
  const navigate = useNavigate();
  const { trackUsage } = useTracking();
  const formatter = useCollator(locale);
  const sortedTokens = [...tokens].sort((a, b) => {
    return sortOrder === "DESC" ? formatter.compare(b.name, a.name) : formatter.compare(a.name, b.name);
  });
  const { canDelete, canUpdate, canRead } = permissions;
  const handleRowClick = (id) => () => {
    if (canRead) {
      trackUsage("willEditTokenFromList", {
        tokenType
      });
      navigate(id.toString());
    }
  };
  return /* @__PURE__ */ jsx(Table$1.Root, { headers, rows: sortedTokens, isLoading, children: /* @__PURE__ */ jsxs(Table$1.Content, { children: [
    /* @__PURE__ */ jsx(Table$1.Head, { children: headers.map((header) => /* @__PURE__ */ jsx(Table$1.HeaderCell, { ...header }, header.name)) }),
    /* @__PURE__ */ jsx(Table$1.Empty, {}),
    /* @__PURE__ */ jsx(Table$1.Loading, {}),
    /* @__PURE__ */ jsx(Table$1.Body, { children: sortedTokens.map((token) => /* @__PURE__ */ jsxs(Table$1.Row, { onClick: handleRowClick(token.id), children: [
      /* @__PURE__ */ jsx(Table$1.Cell, { maxWidth: "25rem", children: /* @__PURE__ */ jsx(Typography, { textColor: "neutral800", fontWeight: "bold", ellipsis: true, children: token.name }) }),
      /* @__PURE__ */ jsx(Table$1.Cell, { maxWidth: "25rem", children: /* @__PURE__ */ jsx(Typography, { textColor: "neutral800", ellipsis: true, children: token.description }) }),
      /* @__PURE__ */ jsx(Table$1.Cell, { children: /* @__PURE__ */ jsx(Typography, { textColor: "neutral800", children: /* @__PURE__ */ jsx(RelativeTime, { timestamp: new Date(token.createdAt) }) }) }),
      /* @__PURE__ */ jsx(Table$1.Cell, { children: token.lastUsedAt && /* @__PURE__ */ jsx(Typography, { textColor: "neutral800", children: /* @__PURE__ */ jsx(
        RelativeTime,
        {
          timestamp: new Date(token.lastUsedAt),
          customIntervals: [
            {
              unit: "hours",
              threshold: 1,
              text: formatMessage({
                id: "Settings.apiTokens.lastHour",
                defaultMessage: "last hour"
              })
            }
          ]
        }
      ) }) }),
      canUpdate || canRead || canDelete ? /* @__PURE__ */ jsx(Table$1.Cell, { children: /* @__PURE__ */ jsxs(Flex, { justifyContent: "end", children: [
        canUpdate && /* @__PURE__ */ jsx(UpdateButton, { tokenName: token.name, tokenId: token.id }),
        canDelete && /* @__PURE__ */ jsx(
          DeleteButton,
          {
            tokenName: token.name,
            onClickDelete: () => onConfirmDelete?.(token.id),
            tokenType
          }
        )
      ] }) }) : null
    ] }, token.id)) })
  ] }) });
};
const MESSAGES_MAP = {
  edit: {
    id: "app.component.table.edit",
    defaultMessage: "Edit {target}"
  },
  read: {
    id: "app.component.table.read",
    defaultMessage: "Read {target}"
  }
};
const DefaultButton = ({
  tokenName,
  tokenId,
  buttonType = "edit",
  children
}) => {
  const { formatMessage } = useIntl();
  return /* @__PURE__ */ jsx(
    LinkButtonStyled,
    {
      tag: NavLink,
      to: tokenId.toString(),
      onClick: (e) => e.stopPropagation(),
      title: formatMessage(MESSAGES_MAP[buttonType], { target: tokenName }),
      variant: "ghost",
      size: "S",
      children
    }
  );
};
const LinkButtonStyled = styled(LinkButton)`
  padding: 0.7rem;

  & > span {
    display: flex;
  }
`;
const DeleteButton = ({ tokenName, onClickDelete, tokenType }) => {
  const { formatMessage } = useIntl();
  const { trackUsage } = useTracking();
  const handleClickDelete = () => {
    trackUsage("willDeleteToken", {
      tokenType
    });
    onClickDelete();
  };
  return /* @__PURE__ */ jsx(Dialog.Root, { children: /* @__PURE__ */ jsxs(Box, { paddingLeft: 1, onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsx(Dialog.Trigger, { children: /* @__PURE__ */ jsx(
      IconButton,
      {
        label: formatMessage(
          {
            id: "global.delete-target",
            defaultMessage: "Delete {target}"
          },
          { target: `${tokenName}` }
        ),
        name: "delete",
        variant: "ghost",
        children: /* @__PURE__ */ jsx(Trash, {})
      }
    ) }),
    /* @__PURE__ */ jsx(ConfirmDialog, { onConfirm: handleClickDelete })
  ] }) });
};
const UpdateButton = ({ tokenName, tokenId }) => {
  return /* @__PURE__ */ jsx(DefaultButton, { tokenName, tokenId, children: /* @__PURE__ */ jsx(Pencil, {}) });
};

export { Table as T };
//# sourceMappingURL=Table-Tm5XxNoq.mjs.map
