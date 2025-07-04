<template>
  <div class="thread-container">
    <div v-if="!props.thread || !user" class="loading-view">
      <font-awesome-icon :icon="['fas', 'spinner']" spin />
      <span>로딩 중</span>
    </div>

    <div v-else class="thread-info">
      <div class="thread-header">
        <div class="thread-user">
          <div class="user-avatar">
            <img
              v-if="user.profile_img"
              :src="user.profile_img"
              alt="user_profile_img"
            />
            <font-awesome-icon v-else :icon="['fas', 'user']" />
          </div>
          <div class="user-info">
            <span class="username">{{ user.username }}</span>
            <button
              v-if="showFollowButton"
              class="follow-btn"
              :class="{ following: isFollowing }"
              @click="handleFollow"
            >
              {{ isFollowing ? '팔로잉' : '팔로우' }}
            </button>
          </div>
        </div>
        <!-- 작성자만 수정, 삭제 가능 -->
        <div class="thread-actions" v-if="userStore.isLogin && userStore.thisUser && userStore.thisUser.id === props.thread.user">
          <button class="action-btn delete" @click="onThreadDelete(props.thread.id)">
            <font-awesome-icon :icon="['fas', 'trash']" />
          </button>
          <button
            class="action-btn edit"
            @click="onThreadUpdate(thread.book.id, thread.id)"
          >
            <font-awesome-icon :icon="['fas', 'edit']" />
          </button>
        </div>
      </div>

      <div class="thread-content">
        <h2 class="thread-title">{{ props.thread.title }}</h2>
        <p class="thread-text">{{ props.thread.content }}</p>
      </div>

      <div class="thread-footer">
        <button
          class="like-btn"
          :class="{ liked: isLiked }"
          @click="handleThreadLikes"
        >
          <font-awesome-icon
            :icon="isLiked ? ['fas', 'heart'] : ['far', 'heart']"
          />
          <span>{{ likesCount }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  thread: {
    type: Object,
    required: true,
  },
})

import { ref, watch, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useBookStore } from '@/stores/book'

const router = useRouter()
const userStore = useUserStore()
const bookStore = useBookStore()
const user = ref(null)
const emit = defineEmits(['update-thread'])

const isFollowing = computed(() => {
  if (!user.value) return false
  return userStore.getFollowStatus(user.value.id)
})

const showFollowButton = computed(() => {
  return (
    userStore.thisUser && user.value && userStore.thisUser.id !== user.value.id
  )
})

const isLiked = computed(() => {
  return (
    userStore.thisUser && props.thread.likes.includes(userStore.thisUser.id)
  )
})

const likesCount = computed(() => {
  return props.thread.likes.length
})

watch(
  () => props.thread?.user,
  async (newUser) => {
    if (newUser) {
      const userData = await userStore.getUser(newUser)
      user.value = userData
    } else {
      user.value = null
    }
  },
  { immediate: true }
)

const onThreadDelete = async (threadId) => {
  await bookStore.deleteThread(threadId)
  await router.push({ name: 'threadList' })
}

const onThreadUpdate = (bookId, threadId) => {
  router.push({ name: 'threadForm', params: { bookId: bookId }, query: {  type: 'edit',threadId: threadId } })
}

const handleThreadLikes = async () => {
  if (!userStore.thisUser) return

  try {
    const userId = userStore.thisUser.id
    const currentLikes = [...props.thread.likes]
    const index = currentLikes.indexOf(userId)

    if (index === -1) {
      currentLikes.push(userId)
    } else {
      currentLikes.splice(index, 1)
    }

    emit('update-thread', {
      ...props.thread,
      likes: currentLikes,
    })

    const updatedThread = await bookStore.likesThread(props.thread.id)

    emit('update-thread', updatedThread)
  } catch (error) {
    console.error('좋아요 업데이트 실패:', error)
    emit('update-thread', props.thread)
  }
}

const handleFollow = async () => {
  try {
    const response = await userStore.followUser(user.value.id)
    if (response) {
      const updatedUser = await userStore.getUser(user.value.id)
      user.value = updatedUser
    }
  } catch (err) {
    console.error(err)
  }
}

onMounted(async () => {
  await userStore.getThisUser()
  if (props.thread?.user) {
    const userData = await userStore.getUser(props.thread.user)
    user.value = userData
  }
})
</script>

<style scoped>
.thread-container {
  background: transparent;
  border: 1px solid rgba(76, 175, 80, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.loading-view {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  height: 200px;
  font-size: 1.1em;
  color: #4caf50;
}

.thread-info {
  display: flex;
  flex-direction: column;
}

.thread-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(76, 175, 80, 0.1);
}

.thread-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-avatar svg {
  font-size: 1.5rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.username {
  font-weight: 600;
  font-size: 1.1em;
}

.follow-btn {
  background: transparent;
  border: 1px solid #4caf50;
  color: #4caf50;
  padding: 0.25rem 1rem;
  border-radius: 20px;
  font-size: 0.9em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.follow-btn.following {
  background: #4caf50;
  color: white;
}

.follow-btn:hover {
  background: rgba(76, 175, 80, 0.1);
}

.thread-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: transparent;
  border: none;
  color: inherit;
  padding: 0.5rem;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.3s ease;
}

.action-btn:hover {
  opacity: 1;
  color: #4caf50;
}

.thread-content {
  padding: 2rem 1.5rem;
  flex-grow: 1;
}

.thread-title {
  font-size: 1.5em;
  font-weight: 600;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.thread-text {
  font-size: 1.1em;
  line-height: 1.6;
  opacity: 0.9;
  white-space: pre-wrap;
}

.thread-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(76, 175, 80, 0.1);
}

.like-btn {
  background: transparent;
  border: none;
  color: inherit;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1em;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.like-btn:hover {
  background: rgba(76, 175, 80, 0.1);
}

.like-btn.liked {
  color: #4caf50;
}

.like-btn svg {
  font-size: 1.2em;
}

@media (max-width: 768px) {
  .thread-header,
  .thread-content,
  .thread-footer {
    padding: 1rem;
  }

  .thread-title {
    font-size: 1.3em;
  }

  .thread-text {
    font-size: 1em;
  }
}
</style>
