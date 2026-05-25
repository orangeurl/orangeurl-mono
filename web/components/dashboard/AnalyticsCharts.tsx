"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { 
  Bar, 
  BarChart, 
  YAxis,
  Area, 
  AreaChart,
  CartesianGrid,
  XAxis,
  Pie,
  PieChart,
  Sector,
  Label
} from "recharts"
import type { PieSectorDataItem } from "recharts/types/polar/Pie"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ClicksByDate {
  date: string
  clicks: number
}

interface DeviceStats {
  device_type: string
  clicks: number
}

interface BrowserStats {
  browser: string
  clicks: number
}

interface CountryStats {
  country: string
  clicks: number
}

interface ReferrerStats {
  source: string
  clicks: number
}

interface ReferrerClicksByDate {
  date: string
  [source: string]: number | string
}

interface AnalyticsChartsProps {
  clicksByDate: ClicksByDate[]
  deviceStats: DeviceStats[]
  browserStats: BrowserStats[]
  countryStats?: CountryStats[]
  referrerStats?: ReferrerStats[]
  referrerClicksByDate?: ReferrerClicksByDate[]
}

export function AnalyticsCharts({ clicksByDate, deviceStats, browserStats, countryStats = [], referrerStats = [], referrerClicksByDate = [] }: AnalyticsChartsProps) {
  const [timeRange, setTimeRange] = React.useState("90d")
  const [referrerTimeRange, setReferrerTimeRange] = React.useState("90d")

  // Country code to flag emoji mapping
  const getCountryFlag = (countryCode: string): string => {
    if (!countryCode || countryCode === '-') return '';
    
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((char: string) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  // Process clicks data for area chart
  const chartData = React.useMemo(() => {
    const sortedData = [...clicksByDate].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    
    // Filter by time range
    const referenceDate = sortedData.length > 0 ? new Date(sortedData[sortedData.length - 1].date) : new Date()
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    
    const filtered = sortedData.filter(item => new Date(item.date) >= startDate)
    
    return filtered.map(item => ({
      date: item.date,
      clicks: item.clicks,
    }))
  }, [clicksByDate, timeRange])

  // Process referrer data for chart - Professional & Balanced Palette
  const referrerData = React.useMemo(() => {
    const professionalColors = [
      "#F97316", // Orange Accent
      "#3B82F6", // Blue Highlight
      "#FACC15", // Muted Yellow
      "#EC4899", // Pink accent
      "#8B5CF6", // Purple accent
      "#10B981", // Green accent
    ]
    return referrerStats.map((ref, index) => {
      // Shorten source for display if it's a URL
      let displaySource = ref.source
      if (ref.source !== "Direct" && ref.source.includes("://")) {
        try {
          const url = new URL(ref.source)
          displaySource = url.hostname.replace("www.", "")
        } catch {
          displaySource = ref.source.length > 30 ? ref.source.substring(0, 30) + "..." : ref.source
        }
      }
      
      return {
        source: displaySource,
        clicks: ref.clicks,
        fill: professionalColors[index % professionalColors.length],
      }
    })
  }, [referrerStats])

  // Process device data for donut chart - Professional & Balanced Palette
  const deviceDonutData = React.useMemo(() => {
    const professionalColors = [
      "#F97316",   // Orange Accent
      "#3B82F6",   // Blue Highlight
      "#FACC15",   // Muted Yellow
      "#9CA3AF",   // Neutral Gray
      "#EC4899",   // Pink accent
    ]
    return deviceStats.map((device, index) => ({
      device: device.device_type,
      visitors: device.clicks,
      fill: professionalColors[index % professionalColors.length],
    }))
  }, [deviceStats])

  // Process browser data for horizontal bar chart - Professional & Balanced Palette
  const browserData = React.useMemo(() => {
    const professionalColors = [
      "#F97316",   // Orange Accent
      "#3B82F6",   // Blue Highlight
      "#FACC15",   // Muted Yellow
      "#9CA3AF",   // Neutral Gray
      "#EC4899",   // Pink accent
    ]
    return browserStats.map((browser, index) => ({
      browser: browser.browser.toLowerCase(),
      visitors: browser.clicks,
      fill: professionalColors[index % professionalColors.length],
    }))
  }, [browserStats])

  const clicksChartConfig = {
    visitors: {
      label: "Clicks",
    },
    clicks: {
      label: "Total Clicks",
      color: "#F97316",
    },
  } satisfies ChartConfig

  const referrerChartConfig = {
    clicks: {
      label: "Clicks",
    },
    direct: {
      label: "Direct",
      color: "#F97316",
    },
    youtube: {
      label: "YouTube",
      color: "#3B82F6",
    },
    x: {
      label: "X",
      color: "#FACC15",
    },
    instagram: {
      label: "Instagram",
      color: "#EC4899",
    },
    linkedin: {
      label: "LinkedIn",
      color: "#8B5CF6",
    },
    medium: {
      label: "Medium",
      color: "#10B981",
    },
    other: {
      label: "Other",
      color: "#9CA3AF",
    },
  } satisfies ChartConfig

  const deviceChartConfig = {
    visitors: {
      label: "Visitors",
    },
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))",
    },
    tablet: {
      label: "Tablet",
      color: "hsl(var(--chart-3))",
    },
    unknown: {
      label: "Unknown",
      color: "hsl(var(--chart-4))",
    },
  } satisfies ChartConfig

  const browserChartConfig = {
    visitors: {
      label: "Visitors",
    },
    chrome: {
      label: "Chrome",
      color: "hsl(var(--chart-1))",
    },
    safari: {
      label: "Safari",
      color: "hsl(var(--chart-2))",
    },
    firefox: {
      label: "Firefox",
      color: "hsl(var(--chart-3))",
    },
    edge: {
      label: "Edge",
      color: "hsl(var(--chart-4))",
    },
    other: {
      label: "Other",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig

  const totalEngagements = React.useMemo(() => {
    return clicksByDate.reduce((acc, curr) => acc + curr.clicks, 0)
  }, [clicksByDate])

  const deviceTotal = React.useMemo(() => {
    return deviceStats.reduce((acc, curr) => acc + curr.clicks, 0)
  }, [deviceStats])

  // Process referrer clicks by date data for area chart
  const referrerChartData = React.useMemo(() => {
    const sortedData = [...referrerClicksByDate].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    // Filter by time range
    const referenceDate = sortedData.length > 0 ? new Date(sortedData[sortedData.length - 1].date) : new Date()
    let daysToSubtract = 90
    if (referrerTimeRange === "30d") {
      daysToSubtract = 30
    } else if (referrerTimeRange === "7d") {
      daysToSubtract = 7
    }

    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)

    return sortedData.filter(item => new Date(item.date) >= startDate)
  }, [referrerClicksByDate, referrerTimeRange])

  // Extract all unique referrer sources from the data (excluding sources with 0 clicks)
  const referrerSources = React.useMemo(() => {
    const sources = new Set<string>()
    referrerChartData.forEach(item => {
      Object.keys(item).forEach(key => {
        if (key !== 'date') {
          const value = item[key]
          if (typeof value === 'number' && value > 0) {
            sources.add(key)
          }
        }
      })
    })
    return Array.from(sources).sort()
  }, [referrerChartData])

  // Generate color for any referrer source
  const getColorForSource = React.useCallback((source: string, index: number) => {
    // Use Direct color for direct traffic
    if (source === "Direct") return "#F97316"
    
    // Professional color palette
    const colors = [
      "#F97316", // Orange
      "#3B82F6", // Blue
      "#EC4899", // Pink
      "#8B5CF6", // Purple
      "#10B981", // Green
      "#FACC15", // Yellow
      "#06B6D4", // Cyan
      "#F59E0B", // Amber
      "#EF4444", // Red
      "#6366F1", // Indigo
    ]
    
    return colors[index % colors.length]
  }, [])

  // Create chart config dynamically based on sources present in data
  const referrerAreaChartConfig = React.useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {}
    referrerSources.forEach((source, index) => {
      // Shorten label for display if it's a URL
      let label = source
      if (source !== "Direct" && source.includes("://")) {
        try {
          const url = new URL(source)
          label = url.hostname.replace("www.", "")
        } catch {
          label = source.length > 30 ? source.substring(0, 30) + "..." : source
        }
      }
      
      config[source] = {
        label: label,
        color: getColorForSource(source, index)
      }
    })
    return config
  }, [referrerSources, getColorForSource])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Clicks Over Time - Line Chart */}
      {chartData.length > 0 && (
        <Card className="col-span-1 lg:col-span-2 pt-0">
          <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
            <div className="grid flex-1 gap-1">
              <CardTitle>Clicks Over Time</CardTitle>
              <CardDescription>
                Showing total clicks for the last {timeRange === "7d" ? "7 days" : timeRange === "30d" ? "30 days" : "3 months"}
              </CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
                aria-label="Select a value"
              >
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="7d" className="rounded-lg">
                  Last 7 days
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  Last 30 days
                </SelectItem>
                <SelectItem value="90d" className="rounded-lg">
                  Last 3 months
                </SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <ChartContainer
              config={clicksChartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="fillClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="#F97316"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor="#F97316"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      }}
                      indicator="dot"
                    />
                  }
                />
                <Area
                  dataKey="clicks"
                  type="monotone"
                  fill="url(#fillClicks)"
                  stroke="#F97316"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Referrer Traffic Over Time - Interactive Area Chart */}
      {referrerChartData.length > 0 && referrerSources.length > 0 && (
        <Card className="col-span-1 lg:col-span-2 pt-0">
          <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
            <div className="grid flex-1 gap-1">
              <CardTitle>Referrer Traffic Over Time</CardTitle>
              <CardDescription>
                Showing traffic sources for the last {referrerTimeRange === "7d" ? "7 days" : referrerTimeRange === "30d" ? "30 days" : "3 months"}
              </CardDescription>
            </div>
            <Select value={referrerTimeRange} onValueChange={setReferrerTimeRange}>
              <SelectTrigger
                className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
                aria-label="Select a value"
              >
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="7d" className="rounded-lg">
                  Last 7 days
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  Last 30 days
                </SelectItem>
                <SelectItem value="90d" className="rounded-lg">
                  Last 3 months
                </SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <ChartContainer
              config={referrerAreaChartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <AreaChart data={referrerChartData}>
                <defs>
                  {referrerSources.map((source, index) => {
                    const color = getColorForSource(source, index)
                    return (
                      <linearGradient key={source} id={`fill${source.replace(/[^a-zA-Z0-9]/g, '_')}`} x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={color}
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor={color}
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                    )
                  })}
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      }}
                      indicator="dot"
                    />
                  }
                />
                {referrerSources.map((source, index) => {
                  const sanitizedId = source.replace(/[^a-zA-Z0-9]/g, '_')
                  const color = getColorForSource(source, index)
                  return (
                    <Area
                      key={source}
                      dataKey={source}
                      type="monotone"
                      fill={`url(#fill${sanitizedId})`}
                      stroke={color}
                      strokeWidth={2}
                      stackId="a"
                    />
                  )
                })}
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Device Distribution - Donut Chart */}
      {deviceStats.length > 0 && (
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Device Distribution</CardTitle>
            <CardDescription>Traffic by device type</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={deviceChartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={deviceDonutData}
                  dataKey="visitors"
                  nameKey="device"
                  innerRadius={60}
                  strokeWidth={5}
                  activeIndex={0}
                  activeShape={({
                    outerRadius = 0,
                    ...props
                  }: PieSectorDataItem) => (
                    <Sector {...props} outerRadius={outerRadius + 10} />
                  )}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {deviceTotal.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Total Clicks
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 leading-none font-medium">
              {deviceStats[0]?.device_type || 'Unknown'} is most popular device <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground leading-none">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>
      )}

      {/* Browser Statistics - Horizontal Bar Chart */}
      {browserStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Browser Statistics</CardTitle>
            <CardDescription>January - June 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={browserChartConfig}>
              <BarChart
                accessibilityLayer
                data={browserData}
                layout="vertical"
                margin={{
                  left: 0,
                }}
              >
                <YAxis
                  dataKey="browser"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) =>
                    browserChartConfig[value as keyof typeof browserChartConfig]?.label || value
                  }
                />
                <XAxis dataKey="visitors" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="visitors" layout="vertical" radius={5} />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 leading-none font-medium">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground leading-none">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>
      )}

      {/* Total Engagements by Location */}
      {countryStats.length > 0 && (
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Total Engagements by Location</CardTitle>
            <CardDescription>
              Showing engagements by country (city data available in Recent Clicks table)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {countryStats.slice(0, 10).map((country, index) => {
                const percentage = totalEngagements > 0 ? Math.round((country.clicks / totalEngagements) * 100) : 0
                const countryFlag = country.country ? getCountryFlag(country.country) : '';
                const countryDisplay = country.country ? `${countryFlag} ${country.country}` : 'Unknown';
                return (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium w-8">{index + 1}</span>
                        <span className="text-sm">{countryDisplay}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold">{country.clicks.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">({percentage}%)</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
