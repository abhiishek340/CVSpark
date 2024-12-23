import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useGlobalContext } from "@/context/global-context"
import { useEffect } from "react"
import { Delete } from 'lucide-react';
import { toast } from "react-hot-toast";



interface InfoProps {
    data: {
        type: string
    }
}

export function Info({ data }: InfoProps) {
  const {addPersonalData} = useGlobalContext();
  const [formCount, setFormCount] = React.useState(1);
  const [personal, setPersonal] = React.useState<Array<{name: string; gpa: string; email: string; city: string; state: string; website: string; github: string; phone: string; linkedin: string }>>([]);

  useEffect(()=>{
    const storedPersonal = localStorage.getItem('personal');
    if (storedPersonal) {
      setPersonal(JSON.parse(storedPersonal));
    }

  },[])
  const handleAddForm = () => {
    setFormCount(prevCount => prevCount + 1);
  };

  const handleChange = (index: number, key: string, value: string) => {
    const updatedPersonal = [...personal];
    updatedPersonal[index] = {...updatedPersonal[index],  [key]: value};
    setPersonal(updatedPersonal);

  }

  const handleSavePersonal = () => {
    localStorage.setItem('personal', JSON.stringify(personal));
    addPersonalData(personal);
    toast.success('Personal Info Added on Resume');


  }

  const handleDeleteAll = () => {
    localStorage.removeItem("personal");
    setPersonal([]);
    addPersonalData([]);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{data.type}</CardTitle>
          <Delete className="cursor-pointer" size={24} onClick={handleDeleteAll} />
        </div>
      </CardHeader>
      <CardContent>
        {[...Array(formCount)].map((_, index) => (
          <form key={index} >
            <div className="grid grid-cols-2 items-center gap-4 mb-5">
                <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                id="name" 
                placeholder="Enter your full name" 
                onChange={e => handleChange(index, 'name', e.target.value)}
                value={personal[index]?.name || ''}

                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="framework">Email</Label>
                <Input 
                id={`email-${index}`} 
                placeholder="Enter your email address" 
                onChange={e => handleChange(index, 'email', e.target.value)}
                value={personal[index]?.email || ''}

                />
                </div>
              
             
                <div className="space-y-2">
                <Label htmlFor={`city-${index}`} >City</Label>
               <Input 
               id={`city-${index}`} 
               placeholder="Enter your city" 
               onChange={e => handleChange(index, 'city', e.target.value)}
               value={personal[index]?.city || ''}

               
               />
               </div>

               <div className="space-y-2">
                <Label htmlFor={`state-${index}`} >State</Label>
               <Input 
               id={`state-${index}`} 
               placeholder="Enter your state" 
               onChange={e => handleChange(index, 'state', e.target.value)}
                value={personal[index]?.state || ''}
               />

               </div>


               <div className="space-y-2"> 
                <Label htmlFor={`website-${index}`}>Website</Label>
               <Input 
               id={`website-${index}`} 
               placeholder="Enter your website URL" 
               onChange={e => handleChange(index, 'website', e.target.value)}
                value={personal[index]?.website || ''}

               />
               </div>

               <div className="space-y-2">
                <Label htmlFor={`github-${index}`}>Github</Label>
               <Input
                id={`github-${index}`} 
                placeholder="Enter your GitHub profile URL" 
                onChange={e => handleChange(index, 'github', e.target.value)}
                value={personal[index]?.github || ''}

                />
               </div>

               <div className="space-y-2">
                <Label htmlFor={`phone-${index}`}>Phone Number</Label>
               <Input 
               id={`phone-${index}`} 
               placeholder="Enter your phone number" 
               onChange={e => handleChange(index, 'phone', e.target.value)}
               value={personal[index]?.phone || ''}

               />
               </div>

               <div className="space-y-2">
                <Label htmlFor={`linkedin-${index}`}>Linkedin</Label>
               <Input 
               id={`linkedin-${index}`}
                placeholder="Enter your LinkedIn profile URL" 
                onChange={e => handleChange(index, 'linkedin', e.target.value)}
                value={personal[index]?.linkedin || ''}
                
                />
               </div>
               
            
            </div>
          </form>
        ))}
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button onClick={handleSavePersonal}>Save Prersonal Info</Button>
      </CardFooter>
    
    </Card>
  )
}
