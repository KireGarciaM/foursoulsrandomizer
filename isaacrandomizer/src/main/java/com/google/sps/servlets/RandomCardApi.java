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

@WebServlet("/randcardapi")
public class RandomCardApi extends HttpServlet {
    private String dbPath;
    
    @Override
    public void init() throws ServletException {
        super.init();
        this.dbPath = getServletContext().getRealPath("/resources/database/testSouls.db");
        System.out.println("Database Path: " + dbPath);
    }
    //private static final String DB_URL = "jdbc:sqlite:/home/erik_garciamontoya/foursoulsrandomizer/isaacrandomizer/src/main/java/com/google/sps/servlets/testSouls.db";

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String DB_URL = "jdbc:sqlite:" + dbPath;

        String jsonString = request.getReader().lines().reduce("", (accumulator, actual) -> accumulator + actual);
        org.json.JSONArray setsArray = new org.json.JSONArray(jsonString);

        String query = "SELECT * FROM character c";
        if (setsArray != null && !setsArray.isEmpty()) {
            query += " WHERE";
            for(int i = 0; i < setsArray.length(); i++){
                query += " c_set not in ('" + setsArray.getString(i) + "')";
                if(i + 1 != setsArray.length()){
                    query += " AND ";
                }
            }
        }

        try (Connection connection = DriverManager.getConnection(DB_URL);
             PreparedStatement statement = connection.prepareStatement(query)) {
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
                .append("\"franch\":\"").append(resultSet.getString("franch")).append("\",")
                .append("\"rname\":\"").append(resultSet.getString("real_name")).append("\",")
                .append("\"flip\":\"").append(resultSet.getString("flip")).append("\",")
                .append("\"set\":\"").append(resultSet.getString("c_set")).append("\",")
                .append("\"eternal_name\":\"").append(resultSet.getString("eternal_name")).append("\"")
            .append("},");
        }
        if (json.length() > 1) json.setLength(json.length()-1); // Remove trailing comma
        json.append("]");
        return json.toString();
    }
}
