// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

// Logs in and logs out the user while also accessing userdata
// retrieved from having logged in. The data is stored in a 
// Json and then sent back as a response.
@WebServlet("/cardapi")
public class CardApiServlet extends HttpServlet {

    private static final String DB_URL = "jdbc:sqlite:/home/erik_garciamontoya/foursoulsrandomizer/isaacrandomizer/src/main/java/com/google/sps/servlets/testSouls.db";

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException{
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        try (Connection conn = DriverManager.getConnection(DB_URL);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT * FROM character")) {

             StringBuilder json = new StringBuilder("[");
             while (rs.next()) {
                if (json.length() > 1) json.append(",");
                json.append("{")
                    .append("\"id\":").append(rs.getInt("id")).append(",")
                    .append("\"name\":\"").append(rs.getString("name")).append("\",")
                    .append("\"franch\":\"").append(rs.getString("franch")).append("\",")
                    .append("\"rname\":\"").append(rs.getString("real_name")).append("\",")
                    .append("\"flip\":\"").append(rs.getString("flip")).append("\",")
                    .append("\"set\":\"").append(rs.getString("c_set")).append("\",")
                    .append("\"eternal_name\":\"").append(rs.getString("eternal_name")).append("\"")
                    .append("}");
        }
        json.append("]");
        out.print(json.toString());
      } catch (Exception e) {
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        out.print("{\"error\":\"" + e.getMessage() + "\"}");
    }
    }
}
