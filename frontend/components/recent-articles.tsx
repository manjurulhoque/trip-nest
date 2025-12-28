import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User } from "lucide-react"

const articles = [
  {
    id: 1,
    title: "10 Hidden Gems in Southeast Asia",
    excerpt: "Discover breathtaking destinations off the beaten path that will make your next adventure unforgettable.",
    author: "Sarah Johnson",
    date: "Dec 15, 2024",
    category: "Travel Tips",
    image: "/placeholder.svg?height=200&width=300",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Budget Travel: How to Save on Accommodation",
    excerpt:
      "Expert tips and tricks to find amazing deals on hotels and vacation rentals without compromising on quality.",
    author: "Mike Chen",
    date: "Dec 12, 2024",
    category: "Budget Travel",
    image: "/placeholder.svg?height=200&width=300",
    readTime: "7 min read",
  },
  {
    id: 3,
    title: "The Ultimate Guide to Solo Travel",
    excerpt:
      "Everything you need to know about traveling alone, from safety tips to making the most of your solo adventure.",
    author: "Emma Davis",
    date: "Dec 10, 2024",
    category: "Solo Travel",
    image: "/placeholder.svg?height=200&width=300",
    readTime: "8 min read",
  },
]

export function RecentArticles() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Travel Inspiration</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <img src={article.image || "/placeholder.svg"} alt={article.title} className="w-full h-48 object-cover" />
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{article.category}</Badge>
                  <span className="text-xs text-gray-500">{article.readTime}</span>
                </div>
                <CardTitle className="text-lg">{article.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">{article.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    {article.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {article.date}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
