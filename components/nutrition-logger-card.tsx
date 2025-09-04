"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Utensils, Plus, Search, Trash2 } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface FoodItem {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  quantity: number
  mealType: "breakfast" | "lunch" | "dinner" | "snack"
  timestamp: Date
}

interface NutritionData {
  name: string
  value: number
  color: string
}

// Mock food database
const FOOD_DATABASE = [
  { name: "Apple", calories: 95, protein: 0.5, carbs: 25, fats: 0.3 },
  { name: "Banana", calories: 105, protein: 1.3, carbs: 27, fats: 0.4 },
  { name: "Chicken Breast (100g)", calories: 165, protein: 31, carbs: 0, fats: 3.6 },
  { name: "Brown Rice (1 cup)", calories: 216, protein: 5, carbs: 45, fats: 1.8 },
  { name: "Salmon (100g)", calories: 208, protein: 25, carbs: 0, fats: 12 },
  { name: "Broccoli (1 cup)", calories: 25, protein: 3, carbs: 5, fats: 0.3 },
  { name: "Greek Yogurt (1 cup)", calories: 130, protein: 23, carbs: 9, fats: 0.4 },
  { name: "Avocado", calories: 234, protein: 3, carbs: 12, fats: 21 },
  { name: "Oatmeal (1 cup)", calories: 147, protein: 5, carbs: 25, fats: 3 },
  { name: "Eggs (2 large)", calories: 140, protein: 12, carbs: 1, fats: 10 },
]

export function NutritionLoggerCard() {
  const [foodLog, setFoodLog] = useState<FoodItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFood, setSelectedFood] = useState<(typeof FOOD_DATABASE)[0] | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [mealType, setMealType] = useState<FoodItem["mealType"]>("breakfast")
  const [showAddModal, setShowAddModal] = useState(false)
  const { toast } = useToast()

  // Load saved food log from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("fitos-food-log")
    if (saved) {
      const parsed = JSON.parse(saved)
      setFoodLog(parsed.map((item: any) => ({ ...item, timestamp: new Date(item.timestamp) })))
    }
  }, [])

  // Save food log to localStorage
  useEffect(() => {
    localStorage.setItem("fitos-food-log", JSON.stringify(foodLog))
  }, [foodLog])

  const filteredFoods = FOOD_DATABASE.filter((food) => food.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const addFoodItem = () => {
    if (!selectedFood) return

    const newItem: FoodItem = {
      id: Date.now().toString(),
      name: selectedFood.name,
      calories: selectedFood.calories * quantity,
      protein: selectedFood.protein * quantity,
      carbs: selectedFood.carbs * quantity,
      fats: selectedFood.fats * quantity,
      quantity,
      mealType,
      timestamp: new Date(),
    }

    setFoodLog((prev) => [...prev, newItem])
    setShowAddModal(false)
    setSelectedFood(null)
    setQuantity(1)
    setSearchQuery("")

    toast({
      title: "Food logged!",
      description: `Added ${quantity}x ${selectedFood.name} to your ${mealType}`,
    })
  }

  const removeFoodItem = (id: string) => {
    setFoodLog((prev) => prev.filter((item) => item.id !== id))
    toast({
      title: "Food removed",
      description: "Item removed from your log",
    })
  }

  // Calculate daily totals
  const dailyTotals = foodLog.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fats: acc.fats + item.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 },
  )

  // Prepare pie chart data
  const pieData: NutritionData[] = [
    { name: "Protein", value: Math.round(dailyTotals.protein * 4), color: "#8884d8" },
    { name: "Carbs", value: Math.round(dailyTotals.carbs * 4), color: "#82ca9d" },
    { name: "Fats", value: Math.round(dailyTotals.fats * 9), color: "#ffc658" },
  ]

  // Group food log by meal type
  const mealGroups = foodLog.reduce(
    (acc, item) => {
      if (!acc[item.mealType]) acc[item.mealType] = []
      acc[item.mealType].push(item)
      return acc
    },
    {} as Record<string, FoodItem[]>,
  )

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Utensils className="h-5 w-5" />
            <CardTitle>Food & Nutrition</CardTitle>
          </div>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Food
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Log Food Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Search Food</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search for food..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {searchQuery && (
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {filteredFoods.map((food) => (
                      <Button
                        key={food.name}
                        variant={selectedFood?.name === food.name ? "default" : "ghost"}
                        className="w-full justify-start text-left h-auto p-3"
                        onClick={() => setSelectedFood(food)}
                      >
                        <div>
                          <div className="font-medium">{food.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {food.calories} cal • {food.protein}g protein • {food.carbs}g carbs • {food.fats}g fat
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                )}

                {selectedFood && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={quantity}
                          onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>Meal Type</Label>
                        <select
                          value={mealType}
                          onChange={(e) => setMealType(e.target.value as FoodItem["mealType"])}
                          className="w-full p-2 border rounded-md bg-background"
                        >
                          <option value="breakfast">Breakfast</option>
                          <option value="lunch">Lunch</option>
                          <option value="dinner">Dinner</option>
                          <option value="snack">Snack</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-sm font-medium mb-2">Nutrition Preview</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>Calories: {Math.round(selectedFood.calories * quantity)}</div>
                        <div>Protein: {Math.round(selectedFood.protein * quantity)}g</div>
                        <div>Carbs: {Math.round(selectedFood.carbs * quantity)}g</div>
                        <div>Fats: {Math.round(selectedFood.fats * quantity)}g</div>
                      </div>
                    </div>

                    <Button onClick={addFoodItem} className="w-full">
                      Add to Log
                    </Button>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Daily Summary */}
          <div className="space-y-4">
            <h3 className="font-semibold">Daily Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{Math.round(dailyTotals.calories)}</div>
                <div className="text-muted-foreground">Calories</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-chart-1">{Math.round(dailyTotals.protein)}g</div>
                <div className="text-muted-foreground">Protein</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-chart-2">{Math.round(dailyTotals.carbs)}g</div>
                <div className="text-muted-foreground">Carbs</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-chart-3">{Math.round(dailyTotals.fats)}g</div>
                <div className="text-muted-foreground">Fats</div>
              </div>
            </div>

            {/* Pie Chart */}
            {dailyTotals.calories > 0 && (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} cal`, "Calories"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Food Log */}
          <div className="space-y-4">
            <h3 className="font-semibold">Today's Food Log</h3>
            <div className="max-h-80 overflow-y-auto space-y-3">
              {Object.entries(mealGroups).map(([meal, items]) => (
                <div key={meal} className="space-y-2">
                  <h4 className="text-sm font-medium capitalize text-muted-foreground">{meal}</h4>
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                      <div className="flex-1">
                        <div className="text-sm font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round(item.calories)} cal • {Math.round(item.protein)}g protein • {Math.round(item.carbs)}g carbs • {Math.round(item.fats)}g fats
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFoodItem(item.id)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ))}
              {foodLog.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <Utensils className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No food logged today</p>
                  <p className="text-xs">Start by adding your first meal!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
