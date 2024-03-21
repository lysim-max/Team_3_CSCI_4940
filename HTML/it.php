<html>
    <table id="infotechTable">
        <tr>
            <th>class</th>
            <th>Credit hours</th>
        </tr>
<?php
$conn = mysqli_connect("127.0.0.1", "root", "CSCI4400", "capstone_project",)
$sql ="SELECT * FROM it";
$result = $conn->query($sql);

if($result ->num_rows > 0){
    while($row = $result-> fetch_assoc()){
      echo "<tr><td> . row["id"] . </tr></td>"
    }
}
    else {
        echo "Error";
    }
    $conn->close();
?>
    </table>
 </html>