import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export default async function Posts() {
  let data = await fetch('http://rails:3000/posts')
  let posts = await data.json()

  return (
    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
      <h2 className="text-2xl font-bold mb-4">投稿</h2>
      <ul className="grid gap-4">
        {posts.map((post) => (
          <li key={post.id}>
            <Card>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
            </Card>
          </li>
        ))}
      </ul>
    </ScrollArea>
  )
}