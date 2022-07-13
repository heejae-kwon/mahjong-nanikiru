import React from 'react';
import * as xlsx from 'xlsx';
import * as path from 'path'

function App() {
  const filePath = path.join(__dirname,"excel", "nanikiru301.xlsx")
  const nanikiru = xlsx.readFile(filePath)
  console.log(filePath)
  return (
    <div>
      Hello world
    </div>
  );
}

export default App;
