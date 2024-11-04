import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from '@/utils/index.ts'; // axiosインスタンスをインポート

export default async function Posts() {
  // fetchの代わりにAxiosでデータを取得
  let response = await api.get('/posts'); // baseURLが適用されるのでURLが短くなる
  let posts = response.data;

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
  );
}
