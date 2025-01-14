/*package com.google.sps.servlets;

public class test {

}*/

// Copyright 2020 Google LLC
//
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

//import java.util.ArrayList;
import java.io.IOException;
import java.sql.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/cards")
public class CardsServlet extends HttpServlet {

    private static final String DB_URL = "jdbc:sqlite:/home/erik_garciamontoya/foursoulsrandomizer/isaacrandomizer/src/main/java/com/google/sps/servlets/testSouls.db";

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String searchText = request.getParameter("searchtext");
        String set = request.getParameter("set");

        String query = "SELECT * FROM cards c";
        
        query += "  WHERE 1=1";

        if (searchText != null && !searchText.isEmpty()) {
            query += " AND c.file_name LIKE ?";
        }

        if (set != null && !set.isEmpty()) {
            query += " AND c_set = ?";
        }

        try (Connection connection = DriverManager.getConnection(DB_URL);
             PreparedStatement statement = connection.prepareStatement(query)) {

            int paramIndex = 1;
            if (searchText != null && !searchText.isEmpty()) {
                statement.setString(paramIndex++, searchText);
            }
            if (set != null && !set.isEmpty()) {
                statement.setString(paramIndex++, set);
            }

            System.out.println(statement);

            ResultSet resultSet = statement.executeQuery();
            response.setContentType("application/json");
            response.getWriter().write(resultSetToJson(resultSet));
        } catch (SQLException e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Database error.");
        }
    }

    private String resultSetToJson(ResultSet resultSet) throws SQLException {
        StringBuilder json = new StringBuilder("[");
        while (resultSet.next()) {
            json.append("{")
                .append("\"id\":").append(resultSet.getInt("id")).append(",")
                .append("\"name\":\"").append(resultSet.getString("name")).append("\",")
                .append("\"set\":\"").append(resultSet.getString("c_set")).append("\",")
                .append("\"deck_type\":\"").append(resultSet.getString("deck_type")).append("\",")
                .append("\"file_name\":\"").append(resultSet.getString("file_name")).append("\",")
                .append("\"franch\":\"").append(resultSet.getString("franch")).append("\"")
                .append("},");
        }
        if (json.length() > 1) json.setLength(json.length()-1); // Remove trailing comma
        json.append("]");
        return json.toString();
    }
}
