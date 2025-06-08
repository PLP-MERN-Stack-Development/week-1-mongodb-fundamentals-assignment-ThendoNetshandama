/*Task 2*/

db.books.insertMany([
  {
    title: 'Becoming Supernatural',
    author: 'Joe Dispenza',
    genre: 'Self-help / Spirituality',
    published_year: 2017,
    price: 18.99,
    in_stock: true,
    pages: 384,
    publisher: 'Hay House Inc'
  },
  {
    title: 'What Happened to You?',
    author: 'Oprah Winfrey',
    genre: 'Psychology / Self-help',
    published_year: 2021,
    price: 20.00,
    in_stock: true,
    pages: 304,
    publisher: 'Flatiron Books'
  },
  {
    title: 'How to Deal with Idiots (And Stop Being One Yourself)',
    author: 'Maxime Rovere',
    genre: 'Self-help / Philosophy',
    published_year: 2020,
    price: 15.99,
    in_stock: true,
    pages: 176,
    publisher: 'Profile Books'
  },
  {
    title: 'The Subtle Art of Not Giving a F*ck',
    author: 'Mark Manson',
    genre: 'Self-help',
    published_year: 2016,
    price: 14.99,
    in_stock: true,
    pages: 224,
    publisher: 'Harper'
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    genre: 'Fiction / Philosophy',
    published_year: 1988,
    price: 16.00,
    in_stock: true,
    pages: 208,
    publisher: 'HarperOne'
  },
  {
    title: 'Who Moved My Cheese?',
    author: 'Spencer Johnson',
    genre: 'Business / Self-help',
    published_year: 1998,
    price: 11.95,
    in_stock: true,
    pages: 96,
    publisher: 'Vermilion'
  },
  {
    title: 'Untamed',
    author: 'Glennon Doyle',
    genre: 'Memoir / Self-help',
    published_year: 2020,
    price: 17.99,
    in_stock: true,
    pages: 352,
    publisher: 'The Dial Press'
  },
  {
    title: 'If She Knew',
    author: 'Blake Pierce',
    genre: 'Mystery / Thriller',
    published_year: 2019,
    price: 0.00,
    in_stock: true,
    pages: 250,
    publisher: 'Blake Pierce'
  },
  {
    title: 'How to Love Someone Without Losing Your Mind',
    author: 'Todd Baratz',
    genre: 'Relationships / Self-help',
    published_year: 2024,
    price: 19.99,
    in_stock: true,
    pages: 240,
    publisher: 'St. Martin\'s Essentials'
  },
  {
    title: 'The Art of War',
    author: 'Sun Tzu',
    genre: 'Philosophy / Strategy',
    published_year: -500,
    price: 9.99,
    in_stock: true,
    pages: 273,
    publisher: 'Various'
  }
]);

// Query 1: Finding all books  in a specific genre
db.books.find({ genre: "Self-help" });

// Query 2: Finding all books published after 2010
db.books.find({ published_year: { $gt: 2010 } });

// Query 3: Finding all books written by Paulo Coelho
db.books.find({ author: "Paulo Coelho" });

//Query 4: Updating the price of a specific book
db.books.updateOne(
  { title: "The Alchemist" },
  { $set: { price: 19.99 } }
);

// Query 5: Delete a book by its title
db.books.deleteOne({ title: "Who Moved My Cheese?" });

//Task 3

// Find books that are both in stock and published after 2010
// Return only title, author, and price
// Sort by price ascending
// Pagination: 5 books per page, page 1

db.books.find(
  { in_stock: true, published_year: { $gt: 2010 } },
  { title: 1, author: 1, price: 1, _id: 0 }
)
.sort({ price: 1 })
.limit(5)
.skip(0);


// To get page 2 (books 6–10), change skip to 5:
// .skip(5);


// Sort by price descending instead:
db.books.find(
  { in_stock: true, published_year: { $gt: 2010 } },
  { title: 1, author: 1, price: 1, _id: 0 }
)
.sort({ price: -1 })
.limit(5)
.skip(0);

// Task 4: Aggregation Pipeline

// 1. Average price of books by genre
db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      averagePrice: { $avg: "$price" },
      count: { $sum: 1 }
    }
  }
]);

// 2. Author with the most books
db.books.aggregate([
  {
    $group: {
      _id: "$author",
      bookCount: { $sum: 1 },
      books: { $push: "$title" }
    }
  },
  { $sort: { bookCount: -1 } },
  { $limit: 1 }
]);

// 3. Group books by publication decade and count
db.books.aggregate([
  {
    $addFields: {
      decade: {
        $subtract: [
          "$published_year",
          { $mod: ["$published_year", 10] }
        ]
      }
    }
  },
  {
    $group: {
      _id: "$decade",
      count: { $sum: 1 },
      books: { $push: "$title" }
    }
  }
]);
//Task 5: Indexing

// 1. Create an index on the 'title' field
db.books.createIndex({ title: 1 })

// 2. Create a compound index on 'author' and 'published_year'
db.books.createIndex({ author: 1, published_year: -1 });

// 3. Use explain() to show performance improvement
db.books.find({ title: "The Alchemist" }).explain("executionStats");
db.books.find({ author: "Paulo Coelho", published_year: { $gt: 2000 } }).explain("executionStats");