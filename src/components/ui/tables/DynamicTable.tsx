import './DynamicTable.css';

type TableProps = {
  labels: string[];
  data: Record<string, any>[];
};

const DynamicTable = ({ labels, data }: TableProps) => {
  return (
    <table className="dynamic-table">
      <thead>
        <tr>
          {labels.map((label, i) => (
            <th key={i}>{label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {labels.map((label, colIndex : any) => {
              console.log(label);
              return (
                <td key={colIndex}>
                  {/* Convert label to lowercase or key-friendly string if needed */}
                  {row[Object.keys(row)[colIndex]]}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DynamicTable;
