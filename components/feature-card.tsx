import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="bg-gray-800 border-gray-700 overflow-hidden group hover:border-blue-500 transition-all duration-300">
      <CardHeader className="p-6">
        <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      </CardHeader>
      <CardContent className="p-6">
        <p className="text-gray-300">{description}</p>
      </CardContent>
    </Card>
  )
}

