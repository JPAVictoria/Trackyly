export const buttonStyle = {
  minWidth: "auto",
  padding: "8px 16px",
  color: "#2F27CE",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: 80,
  height: "100%",
  opacity: 0.6,
  "&:hover": {
    opacity: 1,
    backgroundColor: "rgba(47, 39, 206, 0.04)",
  },
};

export const captionStyle = {
  fontSize: "0.7rem",
  marginTop: "4px",
  color: "#2F27CE",
};

export const buttonStyles = {
  backgroundColor: "#fff",
  color: "#000",
  borderColor: "rgba(45, 45, 45, 0.1)",
  textTransform: "none",
  fontSize: "0.75rem",
  padding: "4px 10px",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#f5f5f5",
    borderColor: "rgba(45, 45, 45, 0.2)",
  },
};

export const centerAligned = {
  headerAlign: "center" as const,
  align: "center" as const,
  headerClassName: "bold-header",
};

export const buttonStylesFilter = {
  variant: "outlined" as const,
  sx: {
    borderColor: "#2d2d2d",
    color: "#2d2d2d",
    padding: "8px 16px",
    fontSize: "0.8125rem",
    textTransform: "none",
    "&:hover": {
      borderColor: "#433BFF",
      color: "#433BFF",
      backgroundColor: "#433BFF10",
    },
  },
};

export const baseButtonStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: 80,
  height: "100%",
  border: "1px solid rgba(45, 45, 45, 0.1)",
  transition: "opacity 0.3s, background-color 0.3s",
  gap: "8px",
  textTransform: "none",
  padding: "10px 16px",
};
