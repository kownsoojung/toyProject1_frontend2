import { Button, ButtonProps, CircularProgress, Select } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PrintIcon from "@mui/icons-material/Print";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { ClearIcon } from "@mui/x-date-pickers";
import { Check } from "@mui/icons-material";

export interface CommonButtonProps extends Omit<ButtonProps, 'onClick'> {
  onClick?: () => void;
  text?: string;
  icon?: React.ReactNode;
  loading?: boolean;
}

// ==================== 액션 버튼들 ====================

export const AddButton = ({ onClick, text = "추가", ...props }: CommonButtonProps) => (
  <Button variant="contained" startIcon={<AddIcon />} onClick={onClick} {...props}>
    {text}
  </Button>
);

export const DeleteButton = ({ onClick, text = "삭제", ...props }: CommonButtonProps) => (
  <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={onClick} {...props}>
    {text}
  </Button>
);

export const SaveButton = ({ onClick, text = "저장", ...props }: CommonButtonProps) => (
  <Button variant="contained" startIcon={<SaveIcon />} onClick={onClick} {...props}>
    {text}
  </Button>
);

export const CancelButton = ({ onClick, text = "취소", ...props }: CommonButtonProps) => (
  <Button variant="outlined" startIcon={<CancelIcon />} onClick={onClick} {...props}>
    {text}
  </Button>
);

export const EditButton = ({ onClick, text = "수정", ...props }: CommonButtonProps) => (
  <Button variant="outlined" startIcon={<EditIcon />} onClick={onClick} {...props}>
    {text}
  </Button>
);

export const RefreshButton = ({ onClick, text = "새로고침", ...props }: CommonButtonProps) => (
  <Button variant="outlined" startIcon={<RefreshIcon />} onClick={onClick} {...props}>
    {text}
  </Button>
);

export const BasicButton = ({ onClick, text = "", ...props }: CommonButtonProps) => (
  <Button variant="outlined" onClick={onClick} {...props}>
    {text}
  </Button>
);

export const SearchButton = ({ onClick, text = "검색", ...props }: CommonButtonProps) => (
  <Button variant="contained" startIcon={<SearchIcon />} onClick={onClick} {...props}>
    {text}
  </Button>
);

export const ClearButton = ({ onClick, text = "초기화", ...props }: CommonButtonProps) => (
  <Button variant="outlined" startIcon={<ClearIcon />} onClick={onClick} {...props}>
    {text}
  </Button>
);
// ==================== 데이터 버튼들 ====================
export const ExcelButton = ({ onClick, text = "Excel", disabled, ...props }: CommonButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!onClick) return;
    
    setIsLoading(true);
    try {
      await onClick();  // async 함수 지원
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="outlined" 
      startIcon={isLoading ? <CircularProgress size={20} /> : <FileDownloadIcon />}
      onClick={handleClick}
      disabled={disabled || isLoading}  // 👈 로딩 중 비활성화
      {...props}
    >
      {isLoading ? "다운로드 중..." : text}
    </Button>
  );
};

export const PdfButton = ({ onClick, text = "PDF", ...props }: CommonButtonProps) => (
  <Button variant="outlined" startIcon={<PictureAsPdfIcon />} onClick={onClick} {...props}>
    {text}
  </Button>
);

export const PrintButton = ({ onClick, text = "인쇄", ...props }: CommonButtonProps) => (
  <Button variant="outlined" startIcon={<PrintIcon />} onClick={onClick} {...props}>
    {text}
  </Button>
);

export const CloseButton = ({ onClick, text = "닫기", ...props }: CommonButtonProps) => (
  <Button variant="outlined" startIcon={<CloseIcon />} onClick={onClick} {...props}>
    {text}
  </Button>
);

export const SelectButton = ({ onClick, text = "선택", ...props }: CommonButtonProps) => (
  <Button variant="contained" startIcon={<Check />} onClick={onClick} {...props}>
    {text}
  </Button>
);
