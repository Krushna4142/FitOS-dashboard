"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function HealthScoreLoader() {
  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          <div className="h-6 w-6 bg-muted animate-pulse rounded" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="relative">
            <div className="h-20 w-20 bg-muted animate-pulse rounded-full" />
          </div>
          <div className="text-right space-y-2">
            <div className="h-4 w-12 bg-muted animate-pulse rounded" />
            <div className="h-3 w-16 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function CardLoader() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="h-5 w-32 bg-muted animate-pulse rounded" />
        <div className="h-3 w-48 bg-muted animate-pulse rounded" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-4 w-full bg-muted animate-pulse rounded" />
        <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
        <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
      </CardContent>
    </Card>
  )
}

export function DashboardLoadingGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <HealthScoreLoader />
      <CardLoader />
      <CardLoader />
      <CardLoader />
      <div className="col-span-full lg:col-span-2">
        <CardLoader />
      </div>
      <CardLoader />
      <CardLoader />
      <CardLoader />
      <CardLoader />
    </div>
  )
}
