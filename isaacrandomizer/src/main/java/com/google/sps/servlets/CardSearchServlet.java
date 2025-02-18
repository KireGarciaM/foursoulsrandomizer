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
import java.io.*;
import java.sql.*;
import java.sql.PreparedStatement;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

// Logs in and logs out the user while also accessing userdata
// retrieved from having logged in. The data is stored in a 
// Json and then sent back as a response.
@WebServlet("/cardsearchapi/")
public class CardSearchServlet  extends HttpServlet {
    private String dbPath;
    
    @Override
    public void init() throws ServletException {
        super.init();
        this.dbPath = getServletContext().getRealPath("/resources/database/testSouls.db");
        System.out.println("Database Path: " + dbPath);
    }

    //String DB_URL = "jdbc:sqlite:" + dbPath;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String DB_URL = "jdbc:sqlite:" + dbPath;

        String searchText = request.getParameter("searchtext");
        String set = request.getParameter("set");
        String d_type = request.getParameter("deck_type");
        String f_type = request.getParameter("footer_type");
        String cardType = request.getParameter("card_type");
        String franch = request.getParameter("franch");
        System.out.println("d_type " + DB_URL);
        String query = "SELECT * FROM cards c";
        
        if (cardType != null && !cardType.isEmpty()) {
            query += " join card_types ct on ct.card_id = c.id";
            query += " join types t on t.id = ct.type_id";
        }

        if (f_type != null && !f_type.isEmpty()) {
            query += " JOIN card_footers cf ON cf.card_id = c.id";
            query += " JOIN footers f ON f.id = cf.footer_id";
        }
        query += "  WHERE 1=1";

        if (searchText != null && !searchText.isEmpty()) {
            if (cardType != null && !cardType.isEmpty())
                query += " AND c.name LIKE ?";
            else
                query += " AND name LIKE ?";
        }

        if (f_type != null && !f_type.isEmpty()) {
            query += " AND f.name = ?";
        }

        if (set != null && !set.isEmpty()) {
            query += " AND c_set = ?";
        }

        if (d_type != null && !d_type.isEmpty()) {
            query += " AND deck_type = ?";
        }

        if (franch != null && !franch.isEmpty()) {
            query += " AND franch = ?";
        }
        if (cardType != null && !cardType.isEmpty()) {
            query += " AND t.name = ?";
        }

        try (Connection connection = DriverManager.getConnection(DB_URL);
             PreparedStatement statement = connection.prepareStatement(query)) {

            int paramIndex = 1;
            if (searchText != null && !searchText.isEmpty()) {
                statement.setString(paramIndex++, "%" + searchText + "%");
            }
            if (f_type != null && !f_type.isEmpty()) {
                statement.setString(paramIndex++, f_type);
            }
            if (set != null && !set.isEmpty()) {
                statement.setString(paramIndex++, set);
            }
            if (d_type != null && !d_type.isEmpty()) {
                statement.setString(paramIndex++, d_type);
            }
            if (franch != null && !franch.isEmpty()) {
                statement.setString(paramIndex++, franch);
            }
            if (cardType != null && !cardType.isEmpty()) {
                statement.setString(paramIndex++, cardType);
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
                .append("\"special\":\"").append(resultSet.getString("special")).append("\",")
                .append("\"franch\":\"").append(resultSet.getString("franch")).append("\"")
                .append("},");
            //System.out.println("filename:" + resultSet.getString("file_name") + "id:" + resultSet.getInt("id") +  "name:" + resultSet.getString("name") +
            // "decktype:" + resultSet.getString("deck_type") + "Set:" + resultSet.getString("c_set") + "Franchise:" + resultSet.getString("franch"));
        }
        if (json.length() > 1) json.setLength(json.length()-1); // Remove trailing comma
        json.append("]");
        return json.toString();
    }

}
