import type { RouteRecordRaw } from 'vue-router'
import { RouterView } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/ex/layout'),
    children: [
      {
        path: '/base',
        name: 'Basic',
        component: RouterView,
        children: [
          {
            path: 'icon',
            name: 'Icon',
            component: () => import('@/ex/views/Icon')
          },
          {
            path: 'button',
            name: 'Button',
            component: () => import('@/ex/views/Button')
          },
          {
            path: 'dropdown',
            name: 'Dropdown',
            component: () => import('@/ex/views/Dropdown')
          },
          {
            path: 'scrollbar',
            name: 'Scrollbar',
            component: () => import('@/ex/views/Scrollbar')
          },
          {
            path: 'lazy-image',
            name: 'LazyImage',
            component: () => import('@/ex/views/LazyImage')
          }
        ]
      },
      {
        path: '/form',
        name: 'Form',
        component: RouterView,
        children: [
          {
            path: 'input',
            name: 'Input',
            component: () => import('@/ex/views/Input')
          },
          {
            path: 'input-number',
            name: 'InputNumber',
            component: () => import('@/ex/views/InputNumber')
          },
          {
            path: 'hash-input',
            name: 'HashInput',
            component: () => import('@/ex/views/HashInput')
          },
          {
            path: 'checkbox',
            name: 'Checkbox',
            component: () => import('@/ex/views/Checkbox')
          },
          {
            path: 'radio',
            name: 'Radio',
            component: () => import('@/ex/views/Radio')
          },
          {
            path: 'date-picker',
            name: 'DatePicker',
            component: () => import('@/ex/views/DatePicker')
          },
          {
            path: 'select',
            name: 'Select',
            component: () => import('@/ex/views/Select')
          },
          {
            path: 'switch',
            name: 'Switch',
            component: () => import('@/ex/views/Switch')
          },
          {
            path: 'slider',
            name: 'Slider',
            component: () => import('@/ex/views/Slider')
          },
          {
            path: 'upload',
            name: 'Upload',
            component: () => import('@/ex/views/Upload')
          },
          {
            path: 'factory',
            name: 'FormFactory',
            component: () => import('@/ex/views/Form/Factory')
          },
          {
            path: 'Search',
            name: 'Search',
            component: () => import('@/ex/views/Search')
          }
        ]
      },
      {
        path: '/table',
        name: 'Table',
        component: RouterView,
        children: [
          {
            path: 'pagination',
            name: 'Pagination',
            component: () => import('@/ex/views/Pagination')
          },
          {
            path: 'paginated-list',
            name: 'PaginatedList',
            component: () => import('@/ex/views/PaginatedList')
          },
          {
            path: 'scroll-list',
            name: 'ScrollList',
            component: () => import('@/ex/views/ScrollList')
          }
        ]
      },
      {
        path: '/display',
        name: 'Display',
        component: RouterView,
        children: [
          {
            path: 'card',
            name: 'Card',
            component: () => import('@/ex/views/Card')
          },
          {
            path: 'drawer',
            name: 'Drawer',
            component: () => import('@/ex/views/Drawer')
          },
          {
            path: 'description',
            name: 'Description',
            component: () => import('@/ex/views/Description')
          },
          {
            path: 'tabs',
            name: 'Tabs',
            component: () => import('@/ex/views/Tabs')
          },
          {
            path: 'image',
            name: 'Image',
            component: () => import('@/ex/views/Image')
          },
          {
            path: 'ellipsis',
            name: 'Ellipsis',
            component: () => import('@/ex/views/Ellipsis')
          },
          {
            path: 'empty',
            name: 'Empty',
            component: () => import('@/ex/views/Empty')
          },
          {
            path: 'skeleton',
            name: 'Skeleton',
            component: () => import('@/ex/views/Skeleton')
          },
          {
            path: 'time',
            name: 'Time',
            component: () => import('@/ex/views/Time')
          },
          {
            path: 'address',
            name: 'Address',
            component: () => import('@/ex/views/Address')
          },
          {
            path: 'contract-interaction',
            name: 'ContractInteraction',
            component: () => import('@/ex/views/ContractInteraction')
          },
          {
            path: 'transaction-waiting',
            name: 'TransactionWaiting',
            component: () => import('@/ex/views/TransactionWaiting')
          }
        ]
      },
      {
        path: '/navs',
        name: 'Navigation',
        component: RouterView,
        children: [
          {
            path: 'back-top',
            name: 'BackTop',
            component: () => import('@/ex/views/BackTop')
          }
        ]
      },
      {
        path: '/feedback',
        name: 'Feedback',
        component: RouterView,
        children: [
          {
            path: 'message',
            name: 'Message',
            component: () => import('@/ex/views/Message')
          },
          {
            path: 'loading-bar',
            name: 'LoadingBar',
            component: () => import('@/ex/views/LoadingBar')
          },
          {
            path: 'tooltip',
            name: 'Tooltip',
            component: () => import('@/ex/views/Tooltip')
          },
          {
            path: 'modal',
            name: 'Modal',
            component: () => import('@/ex/views/Modal')
          }
        ]
      }
    ]
  }
]

export default routes
