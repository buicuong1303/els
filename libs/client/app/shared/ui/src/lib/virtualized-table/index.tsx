/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import clsx from 'clsx';
import { withStyles, WithStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import {
  AutoSizer,
  Column,
  Table,
  TableCellRenderer,
  TableHeaderProps,
} from 'react-virtualized';
import { ReactNode } from 'react';
import { useTheme } from '@mui/material';
import { SxProps } from '@mui/system';

const styles = (theme: Theme) => {
  return ({
    flexContainer: {
      display: 'flex',
      alignItems: 'center',
      boxSizing: 'border-box',
    },
    table: {
    // temporary right-to-left patch, waiting for
    // https://github.com/bvaughn/react-virtualized/issues/454
      '& .ReactVirtualized__Table__headerRow': {
        ...{
          borderBottom: '1px solid rgba(34, 51, 84, 0.1)',
        },
        ...(theme.direction === 'rtl' && {
          paddingLeft: '0 !important',
        }),
        ...(theme.direction !== 'rtl' && {
          paddingRight: '0 !important',
        }),
      },
    },
    tableRow: {
      // cursor: 'pointer',
    },
    tableRowHover: {
      transition: 'all 300ms',
      '&:hover': {
        transition: 'all 0ms',
        backgroundColor: theme?.colors?.secondary?.lighter ?? '#EFF1FF',
      }
    },
    tableCell: {
      flex: 1,
    },
    noClick: {
      cursor: 'initial',
    },
  } as const);
};

interface ColumnData {
  dataKey: string;
  label: ReactNode;
  width: number;
  sx?: SxProps;
}

interface Row {
  index: number;
}

export interface VirtualizedTableRowsRenderedType {
  overscanStartIndex: number;
  overscanStopIndex: number;
  startIndex: number;
  stopIndex: number;
}

interface MuiVirtualizedTableProps extends WithStyles<typeof styles> {
  theme?: Theme;
  columns: readonly ColumnData[];
  markedRows?: number[];
  specialRows?: number[];
  headerHeight?: number | string;
  headerBackgroundColor?: string;
  onRowClick?: (data: any) => void;
  onRowsRendered?: (data: VirtualizedTableRowsRenderedType) => void;
  rowCount: number;
  rowGetter: (row: Row) => { [t: string]: ReactNode };
  rowHeight?: number;
  rest?: any;
}

class MuiVirtualizedTable extends React.PureComponent<MuiVirtualizedTableProps> {
  static defaultProps = {
    headerHeight: 40,
    rowHeight: 52,
  };

  getRowClassName = ({ index }: Row) => {
    const { classes, onRowClick } = this.props;

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    });
  };

  cellRenderer: TableCellRenderer = ({ cellData, columnIndex, rowIndex }: any) => {
    const { theme, columns, markedRows, specialRows, classes, rowHeight, onRowClick, rowGetter } = this.props;
    const inSpecialRows = (specialRows ?? [])?.findIndex(item => item === rowIndex) > -1;
    const inMarkedRows = (markedRows ?? [])?.findIndex(item => item === rowIndex) > -1;

    return (
      <TableCell
        component={'div' as any}
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick === null,
        })}
        variant="body"
        sx={{
          ...inMarkedRows && {
            backgroundColor: theme?.colors.secondary.lighter,
          },
          ...inSpecialRows && {
            backgroundColor: theme?.colors.primary.light,
            color: '#ffffff',
            '.MuiBox-root': {
              color: '#ffffff',
            },
            '.MuiSvgIcon-root': {
              color: '#ffffff',
            },
          },
          cursor: inSpecialRows ? 'default' : onRowClick ? 'pointer' : 'default',
          height: rowHeight,
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          ...columns[columnIndex].sx,
        }}
        onClick={(event) => !onRowClick ? undefined : onRowClick({ event, index: rowIndex, columnIndex, rowData: rowGetter({ index: rowIndex }) })}
      >
        {cellData}
      </TableCell>
    );
  };

  headerRenderer = ({ label, columnIndex }: TableHeaderProps & { columnIndex: number }) => {
    const { headerHeight, headerBackgroundColor, columns, classes } = this.props;

    return (
      <TableCell
        component={'div' as any}
        className={clsx(
          classes.tableCell,
          classes.flexContainer,
          classes.noClick
        )}
        variant="head"
        sx={{
          height: headerHeight,
          backgroundColor: headerBackgroundColor,
          paddingRight: 0,
          padding: 0,
          py: 0.5,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          border: 'unset',
          ...columns[columnIndex].sx,
        }}
      >
        <span>{label}</span>
      </TableCell>
    );
  };

  render() {
    const { classes, columns, rowHeight, headerHeight, onRowsRendered, rest, ...tableProps } = this.props;

    return (
      <AutoSizer>
        {({ height, width }: any) => (
          <Table
            gridStyle={{
              direction: 'inherit',
            }}
            height={height}
            width={width}
            rowHeight={rowHeight!}
            headerHeight={headerHeight!}
            className={classes.table}
            {...tableProps}
            rowClassName={this.getRowClassName}
            onRowsRendered={(data) => {
              if (onRowsRendered) onRowsRendered(data);
            }}
            {...rest}
          >
            {columns.map(({ dataKey, ...other }, index) => {
              return (
                <Column
                  key={dataKey}
                  headerRenderer={(headerProps: any) =>
                    this.headerRenderer({
                      ...headerProps,
                      columnIndex: index,
                    })
                  }
                  className={classes.flexContainer}
                  cellRenderer={this.cellRenderer}
                  dataKey={dataKey}
                  {...other}
                />
              );
            })}
          </Table>
        )}
      </AutoSizer>
    );
  }
}

const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);

interface ReactVirtualizedTable {
  data: { [t: string]: ReactNode }[];
  columns: ColumnData[];
  specialRows?: number[];
  markedRows?: number[];
  columnIgnores?: number[];
  onRowClick?: (index: number) => void;
  onRowsRendered?: (data: VirtualizedTableRowsRenderedType) => void;
  headerHeight?: number | string;
  headerBackgroundColor?: string;
  rowHeight?: number;
  tableHeight?: number | string;
  tableWidth?: number | string;
  rest?: any;
}

const ReactVirtualizedTable = (props: ReactVirtualizedTable) => {
  const { headerHeight, headerBackgroundColor, rowHeight, tableHeight, tableWidth, data, columns, markedRows, specialRows, columnIgnores, onRowClick, onRowsRendered, rest } = props;

  const theme = useTheme();

  return (
    <Paper
      style={{
        height: tableHeight ?? '100%',
        width: tableWidth ?? '100%',
        boxShadow: 'unset',
        overflowY: 'hidden',
      }}
    >
      <VirtualizedTable
        theme={theme}
        rowCount={data.length}
        rowGetter={({ index }) => data[index]}
        columns={columns}
        specialRows={specialRows}
        markedRows={markedRows}
        onRowClick={!onRowClick ? undefined : (data) => {
          const { index, columnIndex } = data;
          const inSpecialRows = (specialRows ?? [])?.findIndex(item => item === index) > -1;
          const inColumnIgnores = (columnIgnores ?? [])?.findIndex(item => item === columnIndex) > -1;

          if (
            index >= 0 &&
            !inSpecialRows &&
            columnIndex >= 0 &&
            !inColumnIgnores
          ) onRowClick(index);
        }}
        headerHeight={headerHeight}
        headerBackgroundColor={headerBackgroundColor}
        rowHeight={rowHeight}
        onRowsRendered={onRowsRendered}
        rest={rest}
      />
    </Paper>
  );
};

export { ReactVirtualizedTable };
