---
title: "Portfolio Website"
displayDate: "Since Q2 2016"
shortContent: "Once my skill in development had improved beyond the point where I could be proud of my products I wanted a page to show them. What better way to display my abilities than to write that page from scratch?"
priority: 4
shown: true
---

This whole website is written from scratch using ASP.NET MVC, a C# web framework which enables C# developers to create websites using the MVC code pattern. The most important thing about a portfolio website to me is the ability to edit the content on the portfolio without having to dig into the code and edit the pages, so I built a custom Content Management System (CMS) to edit all of the pages you see on this website.

The website currently supports YouTube videos, GfyCat links, Imgur links and allows you to upload images from your computer. For saving all of this data I use a MySQL server and a custom-made MySQL library I made for easier access to the database.

For example, this is an example of inserting a new account into the database using the default MySQL data connector:

```csharp
public static bool InsertAccount(Account toInsertAccount)
{
   try
   {
      string sql = "INSERT INTO ACCOUNT(USERNAME, PASSWORD, SALT) VALUES(:username, :password, :salt))";
      using (MySqlConnection conn = Data.Connection())
      {
         using (MySqlCommand cmd = new MySqlCommand(sql, conn))
         {
            cmd.Parameters.Add(new MySqlParameter("username", toInsertAccount.Username));
            cmd.Parameters.Add(new MySqlParameter("password", toInsertAccount.Password));
            cmd.Parameters.Add(new MySqlParameter("salt", toInsertAccount.Salt));
            cmd.ExecuteNonQuery();
         }
      }
      return true;
   }
   catch (MySqlException e)
   {
      Console.WriteLine(e);
      Console.WriteLine(e.Message);
      return false;
   }
}
```

And this is the same code using my custom library:

```csharp
var parameters = new Dictionary<string, object>()
{
   {"username", toInsertAccount.Username},
   {"password", toInsertAccount.Password},
   {"salt", toInsertAccount.Salt}
};
return DB.MainDB.InsertQuery("INSERT INTO ACCOUNT(USERNAME, PASSWORD, SALT) VALUES (?, ?, ?)", parameters);
```

GitHub Repository:

[https://github.com/yschuurmans/YSchuurmansPortfolio/](https://github.com/yschuurmans/YSchuurmansPortfolio/)