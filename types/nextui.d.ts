declare module '@nextui-org/react' {
  import * as React from 'react';
  
  // Basic types
  export type As<Props = any> = React.ElementType<Props>;
  export type Selection = Set<string>;
  
  // Component props
  export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    variant?: 'solid' | 'bordered' | 'light' | 'flat' | 'faded' | 'shadow' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
    isIconOnly?: boolean;
    isDisabled?: boolean;
    isLoading?: boolean;
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    fullWidth?: boolean;
    onPress?: () => void;
    children?: React.ReactNode;
  }
  
  export interface CardProps {
    className?: string;
    shadow?: 'sm' | 'md' | 'lg' | 'none';
    radius?: 'none' | 'sm' | 'md' | 'lg';
    isBlurred?: boolean;
    isPressable?: boolean;
    isHoverable?: boolean;
    disableAnimation?: boolean;
    children?: React.ReactNode;
  }
  
  export interface CardHeaderProps {
    className?: string;
    children?: React.ReactNode;
  }
  
  export interface CardBodyProps {
    className?: string;
    children?: React.ReactNode;
  }
  
  export interface CardFooterProps {
    className?: string;
    children?: React.ReactNode;
  }
  
  export interface InputProps {
    label?: string;
    placeholder?: string;
    type?: string;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    isRequired?: boolean;
    isInvalid?: boolean;
    errorMessage?: string;
    className?: string;
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    children?: React.ReactNode;
  }
  
  export interface SelectProps {
    label?: string;
    placeholder?: string;
    selectedKeys?: string[];
    onSelectionChange?: (keys: Selection) => void;
    isDisabled?: boolean;
    isRequired?: boolean;
    isInvalid?: boolean;
    errorMessage?: string;
    className?: string;
    children?: React.ReactNode;
  }
  
  export interface SelectItemProps {
    key: string;
    value?: string;
    className?: string;
    isDisabled?: boolean;
    children?: React.ReactNode;
  }
  
  export interface ProgressProps {
    value?: number;
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
    isIndeterminate?: boolean;
    className?: string;
    showValueLabel?: boolean;
    minValue?: number;
    maxValue?: number;
    valueLabel?: string;
    label?: string;
  }
  
  export interface ChipProps {
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    variant?: 'solid' | 'bordered' | 'light' | 'flat' | 'faded' | 'shadow' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
    isDisabled?: boolean;
    className?: string;
    children?: React.ReactNode;
  }
  
  export interface TabsProps {
    selectedKey?: string;
    onSelectionChange?: (key: string) => void;
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    variant?: 'solid' | 'bordered' | 'light' | 'underlined';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    classNames?: {
      tabList?: string;
      tab?: string;
      tabContent?: string;
      cursor?: string;
    };
    children?: React.ReactNode;
  }
  
  export interface TabProps {
    key: string;
    title?: React.ReactNode;
    className?: string;
    disabled?: boolean;
    children?: React.ReactNode;
  }
  
  export interface SpinnerProps {
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
  }
  
  export interface TooltipProps {
    content?: React.ReactNode;
    placement?: 'top' | 'right' | 'bottom' | 'left';
    delay?: number;
    className?: string;
    children?: React.ReactNode;
  }
  
  export interface CodeProps {
    className?: string;
    children?: React.ReactNode;
  }

  // Table components
  export interface TableProps {
    'aria-label'?: string;
    className?: string;
    children?: React.ReactNode;
  }

  export interface TableHeaderProps {
    className?: string;
    children?: React.ReactNode;
  }

  export interface TableColumnProps {
    key: string;
    align?: 'start' | 'center' | 'end';
    className?: string;
    children?: React.ReactNode;
  }

  export interface TableBodyProps {
    className?: string;
    children?: React.ReactNode;
  }

  export interface TableRowProps {
    key: string;
    className?: string;
    children?: React.ReactNode;
  }

  export interface TableCellProps {
    className?: string;
    children?: React.ReactNode;
  }

  // Modal components
  export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
    children?: React.ReactNode;
  }

  export interface ModalContentProps {
    className?: string;
    children?: React.ReactNode;
  }

  export interface ModalHeaderProps {
    className?: string;
    children?: React.ReactNode;
  }

  export interface ModalBodyProps {
    className?: string;
    children?: React.ReactNode;
  }

  export interface ModalFooterProps {
    className?: string;
    children?: React.ReactNode;
  }

  // Dropdown components
  export interface DropdownProps {
    className?: string;
    children?: React.ReactNode;
  }

  export interface DropdownTriggerProps {
    className?: string;
    children?: React.ReactNode;
  }

  export interface DropdownMenuProps {
    'aria-label'?: string;
    className?: string;
    children?: React.ReactNode;
  }

  export interface DropdownItemProps {
    key: string;
    className?: string;
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    onPress?: () => void;
    children?: React.ReactNode;
  }

  export interface PaginationProps {
    total: number;
    initialPage?: number;
    page?: number;
    onChange?: (page: number) => void;
    className?: string;
  }
  
  // Export components
  export const Button: React.FC<ButtonProps>;
  export const Card: React.FC<CardProps>;
  export const CardHeader: React.FC<CardHeaderProps>;
  export const CardBody: React.FC<CardBodyProps>;
  export const CardFooter: React.FC<CardFooterProps>;
  export const Input: React.FC<InputProps>;
  export const Select: React.FC<SelectProps>;
  export const SelectItem: React.FC<SelectItemProps>;
  export const Progress: React.FC<ProgressProps>;
  export const Chip: React.FC<ChipProps>;
  export const Tabs: React.FC<TabsProps>;
  export const Tab: React.FC<TabProps>;
  export const Spinner: React.FC<SpinnerProps>;
  export const Tooltip: React.FC<TooltipProps>;
  export const Code: React.FC<CodeProps>;
  export const Divider: React.FC<{ className?: string }>;
  export const Table: React.FC<TableProps>;
  export const TableHeader: React.FC<TableHeaderProps>;
  export const TableColumn: React.FC<TableColumnProps>;
  export const TableBody: React.FC<TableBodyProps>;
  export const TableRow: React.FC<TableRowProps>;
  export const TableCell: React.FC<TableCellProps>;
  export const Modal: React.FC<ModalProps>;
  export const ModalContent: React.FC<ModalContentProps>;
  export const ModalHeader: React.FC<ModalHeaderProps>;
  export const ModalBody: React.FC<ModalBodyProps>;
  export const ModalFooter: React.FC<ModalFooterProps>;
  export const Dropdown: React.FC<DropdownProps>;
  export const DropdownTrigger: React.FC<DropdownTriggerProps>;
  export const DropdownMenu: React.FC<DropdownMenuProps>;
  export const DropdownItem: React.FC<DropdownItemProps>;
  export const Pagination: React.FC<PaginationProps>;
}
