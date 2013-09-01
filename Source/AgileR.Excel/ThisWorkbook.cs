using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Forms;
using AgileR.Core.Entities;
using Microsoft.Office.Interop.Excel;

namespace AgileR.ExcelApp
{
    public partial class ThisWorkbook
    {
        private AgilityClient _client;
        private int _rowNum;
        List<Board> Boards { get; set; }

        private async void ThisWorkbook_Startup(object sender, System.EventArgs e)
        {
            _client = new AgilityClient("http://localhost:50596/");

            Boards = (await _client.Boards()).ToList();
            var board = Boards.First();

            var sheet = Sheets.OfType<Worksheet>().First();
            sheet.Name = board.Title;

            sheet.Cells[1, 1] = "Column Id";
            sheet.Cells[1, 2] = "Column Name";
            sheet.Cells[1, 3] = "Task Id";
            sheet.Cells[1, 4] = "Task Name";
            sheet.Cells[1, 5] = "Task Description";

            _rowNum = 2;
            _rowNum = RenderCells(board, sheet, _rowNum);

            _client.RegisterColumnPropertyModified((columnId, property, newValue) => UpdateColumnProperty(property, _rowNum, sheet, columnId, newValue));

            await _client.Start();

            Application.SheetChange += OnSheetChange;

        }

        private void OnSheetChange(object sh, Range target)
        {
            if (target.Column == 2)
            {
                var colId = ((Range) ((Worksheet) ActiveSheet).Cells[target.Row, 1]).Value2;
                if (colId != null)
                {
                    int columnId = Convert.ToInt32(colId);
                    string newValue = target.Value2.ToString();
                    _client.SendColumnPropertyModified(columnId, "title", newValue);
                    UpdateColumnProperty("title", _rowNum, (Worksheet) ActiveSheet, columnId, newValue);
                }
            }

            ((Microsoft.Office.Interop.Excel.Application)this.Application).SheetChange -= OnSheetChange;
            ((Microsoft.Office.Interop.Excel.Application)this.Application).SheetChange += OnSheetChange;
        }

        private static void UpdateColumnProperty(string property, int maxRows, Worksheet sheet, int columnId, string newValue)
        {
            if (string.Equals("title", property, StringComparison.InvariantCultureIgnoreCase))
            {
                for (int i = 1; i < maxRows; i++)
                {
                    var rowColId = sheet.Cells[i, 1] as Range;
                    dynamic value2 = rowColId.Value2;
                    if (value2 != null && value2.ToString() == columnId.ToString())
                    {
                        sheet.Cells[i, 2] = newValue;
                    }
                }
            }
        }

        private static int RenderCells(Board board, Worksheet sheet, int rowNum)
        {
            for (int i = 0; i < board.Columns.Count; i++)
            {
                var column = board.Columns[i];

                if (column.Tasks == null || column.Tasks.Count == 0)
                {
                    sheet.Cells[rowNum, 1] = column.Id;
                    sheet.Cells[rowNum, 2] = column.Title;
                }

                for (var j = 0; j < column.Tasks.Count; j ++)
                {
                    var task = column.Tasks[j];
                    sheet.Cells[rowNum, 1] = column.Id;
                    sheet.Cells[rowNum, 2] = column.Title;
                    sheet.Cells[rowNum, 3] = task.Id;
                    sheet.Cells[rowNum, 4] = task.Title;
                    sheet.Cells[rowNum, 5] = task.Description;
                    if (j < column.Tasks.Count - 1)
                        rowNum++;
                }
                rowNum++;
            }
            return rowNum;
        }

        private void ThisWorkbook_Shutdown(object sender, System.EventArgs e)
        {
            _client.Dispose();
        }

        #region VSTO Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InternalStartup()
        {
            this.Startup += new System.EventHandler(ThisWorkbook_Startup);
            this.Shutdown += new System.EventHandler(ThisWorkbook_Shutdown);
        }

        #endregion

    }
}
