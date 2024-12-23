import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  image: string;
}

export default function TestimonialCard({ name, role, content, image }: TestimonialCardProps) {
  return (
    <Card className="bg-gray-800 border-gray-700 overflow-hidden w-[300px] flex-shrink-0">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Image
            src={image}
            alt={name}
            width={50}
            height={50}
            className="rounded-full mr-4"
          />
          <div>
            <h4 className="text-lg font-semibold text-white">{name}</h4>
            <p className="text-sm text-gray-400">{role}</p>
          </div>
        </div>
        <p className="text-gray-300 italic">&ldquo;{content}&rdquo;</p>
      </CardContent>
    </Card>
  )
}

