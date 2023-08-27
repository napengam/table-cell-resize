## Demo

[Demo](https://hgsweb.de/)

## Resizable Table Columns

This JavaScript function provides a way to make table columns resizable in HTML tables.   
The original code was based on the work done by [phuocng](https://github.com/phuocng) and can be 
found [here](https://github.com/phuocng/html-dom/blob/master/contents/resize-columns-of-a-table.md).

## How to Use

1. Include the `cellResize.js` script in your HTML:

   ```html
   <script src="cellResize.js"></script>
   ```

2. Call the `initResize(tid)` function, passing the table's ID as an argument:

   ```html
   <script>
       const resizableTable = initResize('your-table-id');
   </script>
   ```

3. You can also set a hook function to execute after resizing using `setHookAfterResize(aFunc)`:

   ```html
   <script>
       resizableTable.setHookAfterResize(() => {
           // Your custom logic after resizing here
       });
   </script>
   ```

## Dependencies

- This function requires no additional dependencies or libraries.

## Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resizable Table Columns Example</title>
    <style>
        table {
            border-collapse: collapse;
            width: 100%;
        }
        th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
        }
    </style>
    <script src="resize-table-columns.js"></script>
</head>
<body>
    <table id="myTable">
        <thead>
            <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Country</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>John Doe</td>
                <td>25</td>
                <td>USA</td>
            </tr>
            <!-- ... more rows ... -->
        </tbody>
    </table>

    <script>
        const resizableTable = initResize('myTable');

        resizableTable.setHookAfterResize(() => {
            console.log('Table column resized!');
        });
    </script>
</body>
</html>
```

Replace `'your-table-id'` with the actual ID of your table. Include this script in your HTML and customize the table ID and hook function as needed.

## License

This code is provided under the [MIT License](LICENSE).


