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

import java.io.*;
import java.sql.*;
import java.sql.PreparedStatement;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/footersearchapi/")
public class FooterSearchServlet  extends HttpServlet {

    private String dbPath;
    
    @Override
    public void init() throws ServletException {
        super.init();
        this.dbPath = getServletContext().getRealPath("/resources/database/testSouls.db");
        System.out.println("Database Path: " + dbPath);
    }

    //private static final String DB_URL = "jdbc:sqlite:/home/erik_garciamontoya/foursoulsrandomizer/isaacrandomizer/src/main/java/com/google/sps/servlets/testSouls.db";

    

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String DB_URL = "jdbc:sqlite:" + dbPath;
        String set = request.getParameter("set");
        String file_name = request.getParameter("file_name");
        String deck_type = request.getParameter("deck_type");

        String query = "SELECT f.name, f.desc FROM cards c";
        
        query += " join card_footers cf on cf.card_id = c.id";
        query += " join footers f on f.id = cf.footer_id";
        query += " where";

        if (set != null && !set.isEmpty()) {
            query += " c.c_set = ?";
        }

        if (file_name != null && !file_name.isEmpty()) {
            query += " AND c.file_name = ?";
        }

        if (deck_type != null && !deck_type.isEmpty()) {
            query += " AND c.deck_type = ?";
        }

        try (Connection connection = DriverManager.getConnection(DB_URL);
             PreparedStatement statement = connection.prepareStatement(query)) {

            int paramIndex = 1;

            if (set != null && !set.isEmpty()) {
                statement.setString(paramIndex++, set);
            }
            if (file_name != null && !file_name.isEmpty()) {
                statement.setString(paramIndex++, file_name);
            }
            if (deck_type != null && !deck_type.isEmpty()) {
                statement.setString(paramIndex++, deck_type);
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
                .append("\"name\":\"").append(resultSet.getString("name")).append("\",")
                .append("\"desc\":\"").append(resultSet.getString("desc")).append("\"")
                .append("},");
        }
        if (json.length() > 1) json.setLength(json.length()-1); // Remove trailing comma
        json.append("]");
        return json.toString();
    }

}
