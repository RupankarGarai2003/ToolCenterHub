import "../Styles/ToolHeading.css";

export default function ToolHeading({
  title = "Heading",
  subtitle = "",
  align = "center",
  size = "lg",
  gradient = true,
}) {
  return (
    <div className={`heading-wrapper ${align}`}>
      <h1
        className={`tool-heading ${size} ${
          gradient ? "gradient-text" : ""
        }`}
      >
        {title}
      </h1>

      {subtitle && <p className="tool-subheading">{subtitle}</p>}
    </div>
  );
}