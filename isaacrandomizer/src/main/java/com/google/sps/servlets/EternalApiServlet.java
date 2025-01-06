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
//import org.json.JSONArray;
//import org.json.JSONObject;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.PreparedStatement;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


// Logs in and logs out the user while also accessing userdata
// retrieved from having logged in. The data is stored in a 
// Json and then sent back as a response.
@WebServlet("/eternalapi")
public class EternalApiServlet extends HttpServlet {

    private static final String DB_URL = "jdbc:sqlite:/home/erik_garciamontoya/foursoulsrandomizer/isaacrandomizer/src/main/java/com/google/sps/servlets/testSouls.db";

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        //String eternName = request.getParameter("eternal_names");
        StringBuilder query = new StringBuilder("SELECT * FROM eternals");
        String jsonString = request.getReader().lines().reduce("", (accumulator, actual) -> accumulator + actual);

        try {
            // Parse the JSON body
            org.json.JSONArray namesArray = new org.json.JSONArray(jsonString);
    
            if (namesArray.length() > 0) {
                query.append(" WHERE eternal_name IN (");
                String placeholders = String.join(",", java.util.Collections.nCopies(namesArray.length(), "?"));
                query.append(placeholders).append(") ORDER BY CASE eternal_name");
            }

            for (int i = 0; i < namesArray.length(); i++) {
                query.append(" WHEN ? THEN ").append(i);
            }

            query.append(" END");
    
            try (Connection conn = DriverManager.getConnection(DB_URL);
                 PreparedStatement pstmt = conn.prepareStatement(query.toString())) {
    
                int index = 1;

                for (int i = 0; i < namesArray.length(); i++) {
                    pstmt.setString(index++, namesArray.getString(i));
                }


                for (int i = 0; i < namesArray.length(); i++) {
                    pstmt.setString(index++, namesArray.getString(i));
                }
                
                System.out.println(namesArray);
                try (ResultSet rs = pstmt.executeQuery()) {
                    StringBuilder json = new StringBuilder("[");
                    while (rs.next()) {
                        if (json.length() > 1) json.append(",");
                        json.append("{")
                            .append("\"id\":").append(rs.getInt("id")).append(",")
                            .append("\"eternal_name\":\"").append(rs.getString("eternal_name")).append("\",")
                            .append("\"flip\":\"").append(rs.getString("flip")).append("\",")
                            .append("\"secondary_item\":\"").append(rs.getString("secondary_item")).append("\",")
                            .append("\"real_name\":\"").append(rs.getString("real_name")).append("\"")
                            .append("}");
                    }
                    json.append("]");
                    out.print(json.toString());
                }
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
}
