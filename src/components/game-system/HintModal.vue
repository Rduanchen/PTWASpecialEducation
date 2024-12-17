<template>
    <Modal @close="closeModal">
        <div class="modal-content">
            <div class="title">
                <h2>{{ hintHeader }}</h2>
            </div>
            <div class="content">
                <p>{{ hintMessage }}</p>
            </div>
            <div class="close-btn">
                <button @click="closeModal">Close</button>
            </div>
        </div>
    </Modal>
</template>

<script>
import Modal from '@components/game-system/Modal.vue';
export default {
    name: 'HintModal',
    components: {
        Modal
    },
    props: {
        config: {
            type: String,
            required: true
        }
    },
    emits: ['close'],
    data() {
        return {
            hintHeader: "",
            hintbody: ""
        }
    },
    methods: {
        closeModal() {
            this.$emit('close');
        }
    }
}
</script>

<style scoped>
.hint-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    text-align: center;
}
</style>