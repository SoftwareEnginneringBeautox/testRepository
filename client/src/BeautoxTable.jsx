function BeautoxTable() {
  return (
    <div className="flex flex-col justify-center items-center">
      <p>For the Beautox Table</p>
      <table className="PRISM-table">
        <thead>
          <tr>
            <th>CLIENT</th>
            <th>PERSON IN CHARGE</th>
            <th>DATE TRANSACTED</th>
            <th>PAYMENT METHOD</th>
            <th>PACKAGES</th>
            <th>TREATMENT</th>
            <th>PAYMENT</th>
            <th>REFERENCE NO.</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Data 1.1</td>
            <td>Data 1.2</td>
            <td>Data 1.3</td>
            <td>Data 1.4</td>
            <td>Data 1.5</td>
            <td>Data 1.6</td>
            <td>Data 1.7</td>
            <td>Data 1.8</td>
          </tr>
          <tr>
            <td>Data 2.1</td>
            <td>Data 2.2</td>
            <td>Data 2.3</td>
            <td>Data 2.4</td>
            <td>Data 2.5</td>
            <td>Data 2.6</td>
            <td>Data 2.7</td>
            <td>Data 2.8</td>
          </tr>
          <tr>
            <td>Data 3.1</td>
            <td>Data 3.2</td>
            <td>Data 3.3</td>
            <td>Data 3.4</td>
            <td>Data 3.5</td>
            <td>Data 3.6</td>
            <td>Data 3.7</td>
            <td>Data 3.8</td>
          </tr>
          <tr>
            <td colSpan="8">
              Page <span>1</span> of <span>8</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
