# 构建阶段
FROM m.daocloud.io/docker.io/library/golang:1.21-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装必要的包
RUN apk add --no-cache git

# 设置Go代理
ENV GOPROXY=https://goproxy.cn,direct
ENV GOSUMDB=sum.golang.google.cn

# 复制go mod文件
COPY go.mod go.sum ./

# 下载依赖
RUN go mod download

# 复制源代码
COPY . .

# 构建应用
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# 运行阶段
FROM m.daocloud.io/docker.io/library/alpine:latest

# 安装ca证书
RUN apk --no-cache add ca-certificates

WORKDIR /root/

# 从构建阶段复制二进制文件
COPY --from=builder /app/main .

# 复制迁移文件
COPY --from=builder /app/migrations ./migrations

# 暴露端口
EXPOSE 8080

# 运行应用
CMD ["./main"]
